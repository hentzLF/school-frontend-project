export type Equipment = {
  id: string;
  name: string;
  description: string;
  providerId: string;
  condition: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateEquipmentRequest = {
  name: string;
  description: string;
  condition: string;
};

export type UpdateEquipmentRequest = Partial<CreateEquipmentRequest>;
