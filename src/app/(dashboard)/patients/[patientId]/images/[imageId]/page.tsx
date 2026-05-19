import { ImageDetailClient } from "./image-detail-client";

export default async function ImageDetailPage({
  params,
}: {
  params: Promise<{ patientId: string; imageId: string }>;
}) {
  const { patientId, imageId } = await params;
  return <ImageDetailClient patientId={patientId} imageId={imageId} />;
}
