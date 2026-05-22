"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  useCreateListing,
  useCounties,
  useCategories,
} from "@/hooks/useListings";
import { useTranslation } from "@/hooks/useTranslation";
import { ApiError } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import { FormAlert } from "@/components/common/FormAlert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

const createListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  priceUnit: z.string().min(1, "Price unit is required"),
  categoryId: z.string().min(1, "Category is required"),
  countyId: z.string().min(1, "County is required"),
});

type CreateListingFormValues = z.infer<typeof createListingSchema>;

const fieldError = "text-xs text-destructive";

export function CreateListingForm() {
  const router = useRouter();
  const createListing = useCreateListing();
  const { data: counties } = useCounties();
  const { data: categories } = useCategories();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateListingFormValues>({
    resolver: zodResolver(createListingSchema),
  });

  const onSubmit = async (data: CreateListingFormValues) => {
    try {
      const listing = await createListing.mutateAsync(data);
      router.push(`/listings/${listing.id}`);
    } catch {
      // Error captured by mutation
    }
  };

  const apiError = createListing.error;
  const errorMessage =
    apiError instanceof ApiError
      ? apiError.message
      : apiError
        ? t("auth.unexpectedError")
        : null;

  const priceUnits = [
    { value: "hour", label: t("listings.perHour") },
    { value: "day", label: t("listings.perDay") },
    { value: "hectare", label: t("listings.perHectare") },
    { value: "job", label: t("listings.perJob") },
  ];

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title={t("listings.createListing")} />

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {errorMessage && <FormAlert message={errorMessage} />}

            <div className="space-y-1.5">
              <Label htmlFor="title">{t("listings.titleLabel")}</Label>
              <Input
                id="title"
                type="text"
                {...register("title")}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p role="alert" className={fieldError}>
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">{t("listings.description")}</Label>
              <Textarea
                id="description"
                rows={4}
                {...register("description")}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <p role="alert" className={fieldError}>
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="price">{t("listings.priceLabel")}</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  aria-invalid={!!errors.price}
                />
                {errors.price && (
                  <p role="alert" className={fieldError}>
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="priceUnit">{t("listings.priceUnit")}</Label>
                <Controller
                  control={control}
                  name="priceUnit"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="priceUnit"
                        className="w-full"
                        aria-invalid={!!errors.priceUnit}
                      >
                        <SelectValue placeholder={t("listings.selectUnit")} />
                      </SelectTrigger>
                      <SelectContent>
                        {priceUnits.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.priceUnit && (
                  <p role="alert" className={fieldError}>
                    {errors.priceUnit.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="categoryId">{t("listings.category")}</Label>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="categoryId"
                        className="w-full"
                        aria-invalid={!!errors.categoryId}
                      >
                        <SelectValue
                          placeholder={t("listings.selectCategory")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId && (
                  <p role="alert" className={fieldError}>
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="countyId">{t("listings.county")}</Label>
                <Controller
                  control={control}
                  name="countyId"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="countyId"
                        className="w-full"
                        aria-invalid={!!errors.countyId}
                      >
                        <SelectValue placeholder={t("listings.selectCounty")} />
                      </SelectTrigger>
                      <SelectContent>
                        {counties?.map((county) => (
                          <SelectItem key={county.id} value={county.id}>
                            {county.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.countyId && (
                  <p role="alert" className={fieldError}>
                    {errors.countyId.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={createListing.isPending}
            >
              {createListing.isPending
                ? t("listings.creating")
                : t("listings.createListing")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
