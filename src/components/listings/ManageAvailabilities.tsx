"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import {
  useAvailabilities,
  useCreateAvailability,
  useDeleteAvailability,
} from "@/hooks/useListings";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = { listingId: string };

function toLocalDatetimeValue(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ManageAvailabilities({ listingId }: Props) {
  const { data: slots = [] } = useAvailabilities(listingId);
  const createSlot = useCreateAvailability(listingId);
  const deleteSlot = useDeleteAvailability(listingId);
  const { t } = useTranslation();

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleAdd = async () => {
    if (!startTime || !endTime) return;
    try {
      await createSlot.mutateAsync({
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });
      setStartTime("");
      setEndTime("");
    } catch {
      // Error shown via mutation state
    }
  };

  return (
    <div className="mt-6">
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        {t("listings.manageAvailabilities")}
      </h2>

      <div className="mb-4 space-y-2">
        {slots.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("listings.noSlots")}</p>
        ) : (
          slots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm"
            >
              <span className={slot.isBooked ? "text-muted-foreground line-through" : "text-foreground"}>
                {new Date(slot.startTime).toLocaleString()} –{" "}
                {new Date(slot.endTime).toLocaleString()}
                {slot.isBooked && (
                  <span className="ml-2 text-xs text-muted-foreground">(booked)</span>
                )}
              </span>
              {!slot.isBooked && (
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label={t("common.delete")}
                  onClick={() => deleteSlot.mutate(slot.id)}
                  disabled={deleteSlot.isPending}
                >
                  <Trash2 className="size-4 text-destructive" aria-hidden="true" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>

      <Card>
        <CardContent className="space-y-3">
          <p className="text-sm font-medium text-foreground">{t("listings.addSlot")}</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="slotStart">{t("listings.startTime")}</Label>
              <Input
                id="slotStart"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="slotEnd">{t("listings.endTime")}</Label>
              <Input
                id="slotEnd"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={handleAdd}
            disabled={!startTime || !endTime || createSlot.isPending}
            size="sm"
          >
            {createSlot.isPending ? t("listings.adding") : t("listings.addSlot")}
          </Button>
          {createSlot.isError && (
            <p className="text-xs text-destructive">{t("common.error")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
