"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  CalendarDays,
} from "lucide-react";
import { useUpdateListing, useDeleteListing } from "@/hooks/useListings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ListingDetail } from "@/types/listing";

type Props = { listing: ListingDetail };

export function OwnerActions({ listing }: Props) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const updateListing = useUpdateListing(listing.id);
  const deleteListing = useDeleteListing(listing.id);

  const handleToggleActive = () => {
    updateListing.mutate({
      title: listing.title,
      description: listing.description ?? "",
      pricePerHectare: listing.pricePerHectare,
      serviceCategoryId: listing.serviceCategoryId,
      isActive: !listing.isActive,
      ...(listing.location
        ? { location: { municipalityId: listing.location.municipalityId } }
        : {}),
    });
  };

  const handleDelete = async () => {
    await deleteListing.mutateAsync();
    setDeleteOpen(false);
    router.push("/listings");
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 px-4 py-3">
      <span className="mr-auto text-sm font-medium text-muted-foreground">
        Your listing
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={handleToggleActive}
        disabled={updateListing.isPending}
      >
        {listing.isActive ? (
          <>
            <ToggleRight className="mr-1.5 size-4 text-green-500" aria-hidden="true" />
            Active
          </>
        ) : (
          <>
            <ToggleLeft className="mr-1.5 size-4 text-muted-foreground" aria-hidden="true" />
            Inactive
          </>
        )}
      </Button>

      <Button
        variant="outline"
        size="sm"
        render={<Link href={`/bookings?listingId=${listing.id}`} />}
      >
        <CalendarDays className="mr-1.5 size-4" aria-hidden="true" />
        Bookings
      </Button>

      <Button
        variant="outline"
        size="sm"
        render={<Link href={`/listings/${listing.id}/edit`} />}
      >
        <Pencil className="mr-1.5 size-4" aria-hidden="true" />
        Edit
      </Button>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogTrigger
          render={
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-1.5 size-4" aria-hidden="true" />
              Delete
            </Button>
          }
        />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete listing</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{listing.title}&quot;? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteListing.isPending}
            >
              {deleteListing.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
