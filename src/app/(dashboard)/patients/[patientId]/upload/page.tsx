import { UploadImageClient } from "./upload-image-client";

export default async function UploadImagePage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  return <UploadImageClient patientId={patientId} />;
}
