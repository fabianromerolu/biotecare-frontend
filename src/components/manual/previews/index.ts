import type { ComponentType } from "react";
import { LoginPreview } from "./LoginPreview";
import { PatientsListPreview } from "./PatientsListPreview";
import { NewPatientPreview } from "./NewPatientPreview";
import { PatientDetailPreview } from "./PatientDetailPreview";
import { PatientEditPreview } from "./PatientEditPreview";
import { PatientDeletePreview } from "./PatientDeletePreview";
import { UploadPreview } from "./UploadPreview";
import { AnalysisPreview } from "./AnalysisPreview";
import { GaugePreview } from "./GaugePreview";
import { GradcamPreview } from "./GradcamPreview";
import { BiomarkersPreview } from "./BiomarkersPreview";
import { ReviewPreview } from "./ReviewPreview";
import { AggregatePreview } from "./AggregatePreview";
import { SubphenotypesPreview } from "./SubphenotypesPreview";

export const MANUAL_PREVIEWS: Record<string, ComponentType> = {
  login: LoginPreview,
  patients_list: PatientsListPreview,
  new_patient: NewPatientPreview,
  patient_detail: PatientDetailPreview,
  patient_edit: PatientEditPreview,
  patient_delete: PatientDeletePreview,
  upload: UploadPreview,
  analysis: AnalysisPreview,
  gauge: GaugePreview,
  gradcam: GradcamPreview,
  biomarkers: BiomarkersPreview,
  review: ReviewPreview,
  aggregate: AggregatePreview,
  subphenotypes: SubphenotypesPreview,
};

export type PreviewId = keyof typeof MANUAL_PREVIEWS;
