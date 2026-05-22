"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  useCreateListing,
  useCounties,
  useCategories,
} from "@/hooks/useListings";
import { ApiError } from "@/lib/api";

const createListingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  priceUnit: z.string().min(1, "Price unit is required"),
  categoryId: z.string().min(1, "Category is required"),
  countyId: z.string().min(1, "County is required"),
});

type CreateListingFormValues = z.infer<typeof createListingSchema>;

export function CreateListingForm() {
  const router = useRouter();
  const createListing = useCreateListing();
  const { data: counties } = useCounties();
  const { data: categories } = useCategories();

  const {
    register,
    handleSubmit,
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
        ? "An unexpected error occurred."
        : null;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Listing</h1>

      {errorMessage && (
        <div
          role="alert"
          className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            {...register("title")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-invalid={!!errors.title}
          />
          {errors.title && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={4}
            {...register("description")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-invalid={!!errors.description}
          />
          {errors.description && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price (EUR)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register("price", { valueAsNumber: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-invalid={!!errors.price}
            />
            {errors.price && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="priceUnit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price Unit
            </label>
            <select
              id="priceUnit"
              {...register("priceUnit")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-invalid={!!errors.priceUnit}
            >
              <option value="">Select unit</option>
              <option value="hour">Per hour</option>
              <option value="day">Per day</option>
              <option value="hectare">Per hectare</option>
              <option value="job">Per job</option>
            </select>
            {errors.priceUnit && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.priceUnit.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="categoryId"
              {...register("categoryId")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-invalid={!!errors.categoryId}
            >
              <option value="">Select category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="countyId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              County
            </label>
            <select
              id="countyId"
              {...register("countyId")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-invalid={!!errors.countyId}
            >
              <option value="">Select county</option>
              {counties?.map((county) => (
                <option key={county.id} value={county.id}>
                  {county.name}
                </option>
              ))}
            </select>
            {errors.countyId && (
              <p role="alert" className="mt-1 text-xs text-red-600">
                {errors.countyId.message}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={createListing.isPending}
          className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createListing.isPending ? "Creating..." : "Create Listing"}
        </button>
      </form>
    </div>
  );
}
