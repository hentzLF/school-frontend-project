"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  useCreateListing,
  useCounties,
  useMunicipalities,
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
  pricePerHectare: z.number().positive("Price must be positive"),
  serviceCategoryId: z.string().min(1, "Category is required"),
  countyId: z.string().optional(),
  municipalityId: z.string().optional(),
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateListingFormValues>({
    resolver: zodResolver(createListingSchema),
  });

  const selectedCountyId = watch("countyId");
  const { data: municipalities } = useMunicipalities(selectedCountyId);

  const onSubmit = async (data: CreateListingFormValues) => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        pricePerHectare: data.pricePerHectare,
        serviceCategoryId: data.serviceCategoryId,
        ...(data.municipalityId
          ? { location: { municipalityId: data.municipalityId } }
          : {}),
      };
      const listing = await createListing.mutateAsync(payload);
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
                <Label htmlFor="pricePerHectare">
                  {t("listings.priceLabel")} (EUR / ha)
                </Label>
                <Input
                  id="pricePerHectare"
                  type="number"
                  step="0.01"
                  min="0.01"
                  {...register("pricePerHectare", { valueAsNumber: true })}
                  aria-invalid={!!errors.pricePerHectare}
                />
                {errors.pricePerHectare && (
                  <p role="alert" className={fieldError}>
                    {errors.pricePerHectare.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="serviceCategoryId">
                  {t("listings.category")}
                </Label>
                <Controller
                  control={control}
                  name="serviceCategoryId"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="serviceCategoryId"
                        className="w-full"
                        aria-invalid={!!errors.serviceCategoryId}
                      >
                        <SelectValue
                          placeholder={t("listings.selectCategory")}
                        >
                          {categories?.find((c) => c.id === field.value)?.name}
                        </SelectValue>
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
                {errors.serviceCategoryId && (
                  <p role="alert" className={fieldError}>
                    {errors.serviceCategoryId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="countyId">{t("listings.county")}</Label>
                <Controller
                  control={control}
                  name="countyId"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={(val) => {
                        field.onChange(val);
                        setValue("municipalityId", undefined);
                      }}
                    >
                      <SelectTrigger id="countyId" className="w-full">
                        <SelectValue placeholder={t("listings.selectCounty")}>
                          {counties?.find((c) => c.id === field.value)?.name}
                        </SelectValue>
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
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="municipalityId">
                  {t("listings.municipality")}
                </Label>
                <Controller
                  control={control}
                  name="municipalityId"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      disabled={!selectedCountyId || !municipalities?.length}
                    >
                      <SelectTrigger id="municipalityId" className="w-full">
                        <SelectValue
                          placeholder={
                            selectedCountyId
                              ? t("listings.selectMunicipality")
                              : t("listings.selectCountyFirst")
                          }
                        >
                          {municipalities?.find((m) => m.id === field.value)
                            ?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {municipalities?.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
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
