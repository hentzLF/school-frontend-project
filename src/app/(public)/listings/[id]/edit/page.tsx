import { EditListingForm } from "@/components/listings/EditListingForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditListingPage({ params }: Props) {
  const { id } = await params;
  return <EditListingForm listingId={id} />;
}
