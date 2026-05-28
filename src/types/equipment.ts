export type Equipment = {
  id: string;
  name: string;
  make: string;
  model?: string;
  manufactureYear?: number;
  horsePower?: number;
  condition: "New" | "Excellent" | "Good" | "Fair" | "Poor";
  status: "Available" | "InUse" | "UnderMaintenance" | "Retired";
  description?: string;
};

export type CreateEquipmentRequest = {
  name: string;
  make: string;
  model?: string;
  manufactureYear?: number;
  horsePower?: number;
  condition: string;
  description?: string;
};

export type UpdateEquipmentRequest = Partial<CreateEquipmentRequest>;
