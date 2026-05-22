"use client";

import { useState } from "react";
import { Plus, Tractor, Trash2 } from "lucide-react";
import {
  useEquipment,
  useCreateEquipment,
  useDeleteEquipment,
} from "@/hooks/useEquipment";
import { useTranslation } from "@/hooks/useTranslation";
import { ApiError } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { FormAlert } from "@/components/common/FormAlert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EquipmentList() {
  const { data: equipment, isLoading, error } = useEquipment();
  const createEquipment = useCreateEquipment();
  const deleteEquipment = useDeleteEquipment();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");

  const conditions = [
    { value: "New", label: t("equipment.conditionNew") },
    { value: "Good", label: t("equipment.conditionGood") },
    { value: "Fair", label: t("equipment.conditionFair") },
    { value: "Poor", label: t("equipment.conditionPoor") },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEquipment.mutateAsync({ name, description, condition });
      setName("");
      setDescription("");
      setCondition("");
      setOpen(false);
    } catch {
      // Error captured by mutation
    }
  };

  const apiError = createEquipment.error;
  const errorMessage =
    apiError instanceof ApiError
      ? apiError.message
      : apiError
        ? t("auth.unexpectedError")
        : null;

  const conditionLabel = (value: string) =>
    conditions.find((c) => c.value === value)?.label ?? value;

  return (
    <div>
      <PageHeader
        title={t("equipment.title")}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}>
              <Plus aria-hidden="true" />
              {t("equipment.addEquipment")}
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("equipment.addEquipment")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && <FormAlert message={errorMessage} />}
                <div className="space-y-1.5">
                  <Label htmlFor="eq-name">{t("equipment.name")}</Label>
                  <Input
                    id="eq-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="eq-description">
                    {t("equipment.description")}
                  </Label>
                  <Textarea
                    id="eq-description"
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="eq-condition">
                    {t("equipment.condition")}
                  </Label>
                  <Select
                    value={condition}
                    onValueChange={(value) => setCondition(value ?? "")}
                  >
                    <SelectTrigger id="eq-condition" className="w-full">
                      <SelectValue
                        placeholder={t("equipment.selectCondition")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <DialogClose
                    render={<Button type="button" variant="outline" />}
                  >
                    {t("common.cancel")}
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={createEquipment.isPending || !condition}
                  >
                    {createEquipment.isPending
                      ? t("equipment.adding")
                      : t("equipment.addEquipment")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {isLoading && <LoadingState label={t("common.loading")} />}

      {error && <ErrorState message={t("equipment.loadError")} />}

      {equipment && equipment.length === 0 && (
        <EmptyState icon={Tractor} title={t("equipment.noEquipment")} />
      )}

      {equipment && equipment.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {equipment.map((item) => (
            <Card key={item.id} size="sm">
              <CardContent className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1.5">
                  <h3 className="font-medium text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <Badge variant="secondary">
                    {conditionLabel(item.condition)}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => deleteEquipment.mutate(item.id)}
                  aria-label={t("common.delete")}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
