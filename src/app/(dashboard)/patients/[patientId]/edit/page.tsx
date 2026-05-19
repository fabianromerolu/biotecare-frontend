import { EditPatientClient } from "./edit-patient-client";

export default async function EditPatientPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  return <EditPatientClient patientId={patientId} />;
}
