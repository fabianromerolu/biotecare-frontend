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
  listPatientImages,
  predictImage,
  reviewPrediction,
  uploadImage,
} from "@/lib/api/images";
import type { AggregatePatientInput, PredictionRead, UploadImageInput } from "@/types/api";

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
    mutationFn: (input: UploadImageInput) => uploadImage(patientId, input, setProgress),
    onMutate: () => setProgress(0),
    onSuccess: (image) => {
      setProgress(100);
      queryClient.invalidateQueries({ queryKey: ["patients", patientId, "images"] });
      toast.success("Imagen cargada.");
      router.push(`/patients/${patientId}/images/${image.id}`);
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
      toast.success("Analisis de IA completado.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useImageFile(imageId: string) {
  return useQuery({
    queryKey: ["images", imageId, "file"],
    queryFn: () => getImageFileBlob(imageId),
    staleTime: 10 * 60_000,
    retry: false,
  });
}

export function useHeatmap(imageId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["images", imageId, "heatmap"],
    queryFn: () => getHeatmapBlob(imageId),
    enabled,
    staleTime: 5 * 60_000,
    retry: false,
  });
}

export function useAggregatePatient(patientId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AggregatePatientInput) => aggregatePatient(patientId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients", patientId] });
      toast.success("Prediccion agregada creada.");
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
      toast.success("Revision medica registrada.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
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
