"use client";

import { useState } from "react";
import { Trash2, Plus, Clock } from "lucide-react";
import {
  useAvailabilities,
  useCreateAvailability,
  useDeleteAvailability,
} from "@/hooks/useListings";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = { listingId: string };

function buildTimeOptions(): { value: string; label: string }[] {
  const options = [];
  for (let h = 0; h < 24; h++) {
    for (const m of [0, 30]) {
      const hh = String(h).padStart(2, "0");
      const mm = String(m).padStart(2, "0");
      options.push({ value: `${hh}:${mm}`, label: `${hh}:${mm}` });
    }
  }
  return options;
}

const TIME_OPTIONS = buildTimeOptions();

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString([], {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function ManageAvailabilities({ listingId }: Props) {
  const { data: slots = [] } = useAvailabilities(listingId);
  const createSlot = useCreateAvailability(listingId);
  const deleteSlot = useDeleteAvailability(listingId);
  const { t } = useTranslation();

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("17:00");

  const endOptions = TIME_OPTIONS.filter((o) => o.value > startTime);

  const handleStartChange = (val: string | null) => {
    if (!val) return;
    setStartTime(val);
    if (endTime <= val) {
      setEndTime(TIME_OPTIONS.find((o) => o.value > val)?.value ?? "");
    }
  };

  const handleAdd = async () => {
    if (!date || !startTime || !endTime) return;
    const start = new Date(`${date}T${startTime}:00`);
    const end = new Date(`${date}T${endTime}:00`);
    if (end <= start) return;
    try {
      await createSlot.mutateAsync({
        startTime: start.toISOString(),
        endTime: end.toISOString(),
      });
      setDate("");
      setStartTime("08:00");
      setEndTime("17:00");
    } catch {
      // error shown via mutation state
    }
  };

  // Group slots by date string for display
  const slotsByDate = slots.reduce<Record<string, typeof slots>>((acc, slot) => {
    const day = formatDate(slot.startTime);
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {});

  return (
    <div className="mt-6">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        {t("listings.manageAvailabilities")}
      </h2>

      <div className="mb-6 space-y-4">
        {slots.length === 0 ? (
          <p className="rounded-md border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            {t("listings.noSlots")}
          </p>
        ) : (
          Object.entries(slotsByDate).map(([day, daySlots]) => (
            <div key={day}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {day}
              </p>
              <div className="space-y-1.5">
                {daySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between rounded-md border bg-card px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <span
                        className={`text-sm ${slot.isBooked ? "text-muted-foreground line-through" : "text-foreground"}`}
                      >
                        {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                      </span>
                      {slot.isBooked && (
                        <Badge variant="secondary" className="text-xs">
                          booked
                        </Badge>
                      )}
                    </div>
                    {!slot.isBooked && (
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label={t("common.delete")}
                        onClick={() => deleteSlot.mutate(slot.id)}
                        disabled={deleteSlot.isPending}
                        className="h-7 w-7 p-0"
                      >
                        <Trash2 className="size-3.5 text-destructive" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <Card>
        <CardHeader className="pb-3 pt-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="size-4" aria-hidden="true" />
            {t("listings.addSlot")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">
          <div className="space-y-1.5">
            <Label htmlFor="slotDate">Date</Label>
            <Input
              id="slotDate"
              type="date"
              value={date}
              min={todayIso()}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t("listings.startTime")}</Label>
              <Select value={startTime} onValueChange={handleStartChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>{t("listings.endTime")}</Label>
              <Select value={endTime} onValueChange={(val) => { if (val) setEndTime(val); }} disabled={!endOptions.length}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {endOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleAdd}
            disabled={!date || !startTime || !endTime || createSlot.isPending}
            className="w-full"
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
