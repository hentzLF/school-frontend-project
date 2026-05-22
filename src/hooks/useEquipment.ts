"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { EQUIPMENT_ROUTES } from "@/config/constants";
import type { Equipment, CreateEquipmentRequest } from "@/types/equipment";

export function useEquipment() {
  return useQuery<Equipment[]>({
    queryKey: ["equipment"],
    queryFn: () => api<Equipment[]>(EQUIPMENT_ROUTES.list),
  });
}

export function useCreateEquipment() {
  const queryClient = useQueryClient();

  return useMutation<Equipment, Error, CreateEquipmentRequest>({
    mutationFn: (data) =>
      api<Equipment>(EQUIPMENT_ROUTES.list, { method: "POST", body: data }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
}

export function useDeleteEquipment() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      api<void>(EQUIPMENT_ROUTES.detail(id), { method: "DELETE" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });
}
