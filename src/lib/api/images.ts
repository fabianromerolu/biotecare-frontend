import type { AxiosProgressEvent } from "axios";
import { apiClient } from "@/lib/api/client";
import type {
  AggregatePatientInput,
  ImageRead,
  PredictionRead,
  UploadImageInput,
} from "@/types/api";

export async function listPatientImages(patientId: string): Promise<ImageRead[]> {
  const { data } = await apiClient.get<ImageRead[]>(`/patients/${patientId}/images`);
  return data;
}

export async function getImage(imageId: string): Promise<ImageRead> {
  const { data } = await apiClient.get<ImageRead>(`/images/${imageId}`);
  return data;
}

export async function uploadImage(
  patientId: string,
  input: UploadImageInput,
  onProgress?: (progress: number) => void,
): Promise<ImageRead> {
  const formData = new FormData();
  formData.append("file", input.file);
  if (input.eye) {
    formData.append("eye", input.eye);
  }
  if (input.z_depth_um !== null && input.z_depth_um !== undefined) {
    formData.append("z_depth_um", String(input.z_depth_um));
  }

  const { data } = await apiClient.post<ImageRead>(`/patients/${patientId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event: AxiosProgressEvent) => {
      if (event.total && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    },
  });
  return data;
}

export async function predictImage(imageId: string, threshold: number): Promise<PredictionRead> {
  const { data } = await apiClient.post<PredictionRead>(`/images/${imageId}/predict`, null, {
    params: { threshold },
    timeout: 0,
  });
  return data;
}

export async function getHeatmapBlob(imageId: string): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(`/images/${imageId}/heatmap`, {
    responseType: "blob",
  });
  return data;
}

export async function getImageFileBlob(imageId: string): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(`/images/${imageId}/preview`, {
    responseType: "blob",
  });
  return data;
}

export async function aggregatePatient(
  patientId: string,
  input: AggregatePatientInput,
): Promise<PredictionRead> {
  const { data } = await apiClient.post<PredictionRead>(
    `/patients/${patientId}/aggregate`,
    input,
  );
  return data;
}

export async function reviewPrediction(
  predictionId: string,
  doctorAccepted: boolean,
): Promise<PredictionRead> {
  const { data } = await apiClient.patch<PredictionRead>(`/predictions/${predictionId}/review`, {
    doctor_accepted: doctorAccepted,
  });
  return data;
}

export async function getImagePrediction(imageId: string): Promise<PredictionRead> {
  const { data } = await apiClient.get<PredictionRead>(`/images/${imageId}/prediction`);
  return data;
}

export async function getPatientPrediction(patientId: string): Promise<PredictionRead> {
  const { data } = await apiClient.get<PredictionRead>(`/patients/${patientId}/prediction`);
  return data;
}
