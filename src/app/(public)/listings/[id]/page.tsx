import { ListingDetail } from "@/components/listings/ListingDetail";

type Props = { params: Promise<{ id: string }> };

export default async function ListingPage({ params }: Props) {
  const { id } = await params;
  return <ListingDetail listingId={id} />;
}
