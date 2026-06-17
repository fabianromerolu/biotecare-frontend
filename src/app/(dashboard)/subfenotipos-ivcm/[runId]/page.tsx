import { SubphenotypeRunDetailClient } from "./run-detail-client";

export default async function SubphenotypeRunDetailPage({
  params,
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  return <SubphenotypeRunDetailClient runId={runId} />;
}
