export type UserRole = "doctor" | "admin";
export type PatientSex = "F" | "M" | "O";
export type ImageStatus = "uploaded" | "preprocessed" | "predicted" | "failed";
export type PredictionType = "image" | "patient";
export type AggregationMethod = "mean" | "max" | "attention";
export type PredictionLabel = "dry_eye" | "normal";
export type EyeSide = "OD" | "OS";

export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserRead {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

export interface PatientRead {
  id: string;
  external_code: string;
  birth_year: number | null;
  sex: PatientSex | null;
  doctor_id: string;
  created_at: string;
}

export interface ImageRead {
  id: string;
  patient_id: string;
  original_filename: string;
  mime_type: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  eye: EyeSide | null;
  z_depth_um: number | null;
  acquisition_date: string | null;
  status: ImageStatus;
  created_at: string;
}

export interface Biomarkers {
  CNFL?: number | null;
  CNFD?: number | null;
  CNBD?: number | null;
  dendritic_cell_count?: number | null;
  microneuroma_count?: number | null;
  n_images?: number | null;
}

export interface PredictionRead {
  id: string;
  type: PredictionType;
  patient_id: string;
  image_id: string | null;
  dry_eye_probability: number;
  predicted_label: PredictionLabel;
  threshold: number;
  biomarkers: Biomarkers | null;
  heatmap_path: string | null;
  aggregation_method: AggregationMethod | null;
  model_version: string;
  doctor_override: boolean | null;
  created_at: string;
}

export interface HealthRead {
  status: "ok" | "degraded";
  database: "ok" | "fail";
}

export interface ModelInfoRead {
  model_version: string;
  task: string;
  labels: PredictionLabel[];
  biomarkers: string[];
}

export interface PatientCreateInput {
  external_code: string;
  birth_year?: number | null;
  sex?: PatientSex | null;
}

export type PatientUpdateInput = Pick<PatientCreateInput, "birth_year" | "sex">;

export interface UploadImageInput {
  file: File;
  eye?: EyeSide | null;
  z_depth_um?: number | null;
}

export interface AggregatePatientInput {
  aggregation_method: AggregationMethod;
  threshold: number;
}
