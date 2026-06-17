"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  aggregatePatient,
  getHeatmapBlob,
  getImage,
  getImageFileBlob,
  getImagePrediction,
  getPatientPrediction,
  listPatientImages,
  predictImage,
  reviewPrediction,
  uploadImage,
} from "@/lib/api/images";
import type { AggregatePatientInput, ImageRead, PredictionRead, UploadImagesInput } from "@/types/api";

export function usePatientImages(patientId: string, enabled = true) {
  return useQuery({
    queryKey: ["patients", patientId, "images"],
    queryFn: () => listPatientImages(patientId),
    staleTime: 10_000,
    enabled,
  });
}

export function useImage(imageId: string) {
  return useQuery({
    queryKey: ["images", imageId],
    queryFn: () => getImage(imageId),
  });
}

export function useImageUpload(patientId: string) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (input: UploadImagesInput) => {
      const uploaded: ImageRead[] = [];
      const total = input.files.length;
      for (const [index, file] of input.files.entries()) {
        const image = await uploadImage(
          patientId,
          {
            file,
            eye: input.eye,
            z_depth_um: input.z_depth_um,
          },
          (fileProgress) => {
            const completed = index / total;
            const current = fileProgress / 100 / total;
            setProgress(Math.round((completed + current) * 100));
          },
        );
        uploaded.push(image);
      }
      return uploaded;
    },
    onMutate: () => setProgress(0),
    onSuccess: (images) => {
      setProgress(100);
      queryClient.invalidateQueries({ queryKey: ["patients", patientId, "images"] });
      toast.success(
        images.length === 1 ? "Imagen cargada." : `${images.length} imagenes cargadas.`,
      );
      if (images.length === 1 && images[0]) {
        router.push(`/patients/${patientId}/images/${images[0].id}`);
        return;
      }
      router.push(`/patients/${patientId}`);
    },
    onError: (error) => {
      setProgress(0);
      toast.error(getApiErrorMessage(error));
    },
  });

  return { ...mutation, progress };
}

export function usePredictImage(patientId: string, imageId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (threshold: number) => predictImage(imageId, threshold),
    onSuccess: (prediction) => {
      cachePrediction(imageId, prediction);
      queryClient.invalidateQueries({ queryKey: ["images", imageId] });
      queryClient.invalidateQueries({ queryKey: ["images", imageId, "heatmap"] });
      queryClient.invalidateQueries({ queryKey: ["patients", patientId, "images"] });
      toast.success("Análisis de IA completado.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useImageFile(imageId: string, enabled = true) {
  return useQuery({
    queryKey: ["images", imageId, "file"],
    queryFn: () => getImageFileBlob(imageId),
    enabled,
    staleTime: 10 * 60_000,
    retry: 1,
    retryDelay: 1000,
  });
}

export function useHeatmap(imageId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["images", imageId, "heatmap"],
    queryFn: () => getHeatmapBlob(imageId),
    enabled,
    staleTime: 10 * 60_000,
    gcTime: 30 * 60_000,
    retry: 1,
    retryDelay: 2000,
  });
}

export function useAggregatePatient(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AggregatePatientInput) => aggregatePatient(patientId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients", patientId] });
      toast.success("Predicción agregada creada.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useReviewPrediction(imageId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      predictionId,
      doctorAccepted,
    }: {
      predictionId: string;
      doctorAccepted: boolean;
    }) => reviewPrediction(predictionId, doctorAccepted),
    onSuccess: (prediction) => {
      if (imageId) {
        cachePrediction(imageId, prediction);
        queryClient.invalidateQueries({ queryKey: ["images", imageId] });
      }
      toast.success("Revisión médica registrada.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useImagePrediction(imageId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["images", imageId, "prediction"],
    queryFn: () => getImagePrediction(imageId),
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}

export function usePatientPrediction(patientId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["patients", patientId, "prediction"],
    queryFn: () => getPatientPrediction(patientId),
    enabled,
    staleTime: 60_000,
    retry: false,
  });
}

export function readCachedPrediction(imageId: string): PredictionRead | null {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.sessionStorage.getItem(predictionCacheKey(imageId));
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as PredictionRead;
  } catch {
    return null;
  }
}

export function cachePrediction(imageId: string, prediction: PredictionRead) {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(predictionCacheKey(imageId), JSON.stringify(prediction));
}

function predictionCacheKey(imageId: string) {
  return `biotecare_prediction_${imageId}`;
}
