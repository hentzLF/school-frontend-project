"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AdminDashboard, AdminUser } from "@/types/admin";
import type { Booking } from "@/types/booking";
import type { Category } from "@/types/category";
import type { Listing } from "@/types/listing";
import type { Payment } from "@/types/payment";

const ADMIN_API = "/api/admin";

export function useAdminDashboard() {
  return useQuery<AdminDashboard>({
    queryKey: ["admin", "dashboard"],
    queryFn: () => api<AdminDashboard>(`${ADMIN_API}/dashboard`),
  });
}

export function useAdminUsers() {
  return useQuery<AdminUser[]>({
    queryKey: ["admin", "users"],
    queryFn: () => api<AdminUser[]>(`${ADMIN_API}/users`),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation<AdminUser, Error, { id: string; role: string }>({
    mutationFn: ({ id, role }) =>
      api<AdminUser>(`${ADMIN_API}/users/${id}`, { method: "PUT", body: { role } }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      api<void>(`${ADMIN_API}/users/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useAdminBookings() {
  return useQuery<Booking[]>({
    queryKey: ["admin", "bookings"],
    queryFn: () => api<Booking[]>(`${ADMIN_API}/bookings`),
  });
}

export function useAdminCategories() {
  return useQuery<Category[]>({
    queryKey: ["admin", "categories"],
    queryFn: () => api<Category[]>(`${ADMIN_API}/categories`),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation<Category, Error, { name: string; description?: string }>({
    mutationFn: (data) =>
      api<Category>(`${ADMIN_API}/categories`, { method: "POST", body: data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      api<void>(`${ADMIN_API}/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useAdminListings() {
  return useQuery<Listing[]>({
    queryKey: ["admin", "listings"],
    queryFn: () => api<Listing[]>(`${ADMIN_API}/listings`),
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      api<void>(`${ADMIN_API}/listings/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "listings"] });
      void queryClient.invalidateQueries({ queryKey: ["listings"] });
    },
  });
}

export function useAdminPayments() {
  return useQuery<Payment[]>({
    queryKey: ["admin", "payments"],
    queryFn: () => api<Payment[]>(`${ADMIN_API}/payments`),
  });
}
