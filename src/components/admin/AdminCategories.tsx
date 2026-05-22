"use client";

import { useState } from "react";
import { Plus, Tags, Trash2 } from "lucide-react";
import {
  useAdminCategories,
  useCreateCategory,
  useDeleteCategory,
} from "@/hooks/useAdmin";
import { useTranslation } from "@/hooks/useTranslation";
import { ApiError } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { FormAlert } from "@/components/common/FormAlert";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminCategories() {
  const { data: categories, isLoading, error } = useAdminCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createCategory.mutateAsync({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      setName("");
      setDescription("");
    } catch {
      // Error captured by mutation
    }
  };

  const apiError = createCategory.error;
  const errorMessage =
    apiError instanceof ApiError
      ? apiError.message
      : apiError
        ? t("auth.unexpectedError")
        : null;

  return (
    <div>
      <PageHeader title={t("admin.categoryManagement")} />

      <Card className="mb-6">
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-3">
            {errorMessage && <FormAlert message={errorMessage} />}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="cat-name">{t("admin.name")}</Label>
                <Input
                  id="cat-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="cat-desc">{t("equipment.description")}</Label>
                <Input
                  id="cat-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={createCategory.isPending}>
                <Plus aria-hidden="true" />
                {t("admin.addCategory")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading && <LoadingState label={t("common.loading")} />}

      {error && <ErrorState message={t("admin.loadError")} />}

      {categories && categories.length === 0 && (
        <EmptyState icon={Tags} title={t("common.noResults")} />
      )}

      {categories && categories.length > 0 && (
        <div className="space-y-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10"
            >
              <div className="min-w-0">
                <p className="font-medium text-foreground">{category.name}</p>
                {category.description && (
                  <p className="truncate text-sm text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </div>
              <ConfirmDialog
                title={t("admin.confirmDelete")}
                description={t("admin.confirmDeleteText")}
                confirmLabel={t("common.delete")}
                cancelLabel={t("common.cancel")}
                onConfirm={() => deleteCategory.mutate(category.id)}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={t("common.delete")}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
