"use client";

import { useState } from "react";
import {
  useEquipment,
  useCreateEquipment,
  useDeleteEquipment,
} from "@/hooks/useEquipment";
import { ApiError } from "@/lib/api";

export function EquipmentList() {
  const { data: equipment, isLoading, error } = useEquipment();
  const createEquipment = useCreateEquipment();
  const deleteEquipment = useDeleteEquipment();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [condition, setCondition] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEquipment.mutateAsync({ name, description, condition });
      setName("");
      setDescription("");
      setCondition("");
      setShowForm(false);
    } catch {
      // Error captured by mutation
    }
  };

  const apiError = createEquipment.error;
  const errorMessage =
    apiError instanceof ApiError
      ? apiError.message
      : apiError
        ? "An unexpected error occurred."
        : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Equipment</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
        >
          {showForm ? "Cancel" : "Add Equipment"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 p-4 bg-white border border-gray-200 rounded-lg space-y-3"
        >
          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm"
            >
              {errorMessage}
            </div>
          )}
          <div>
            <label
              htmlFor="eq-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              id="eq-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="eq-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="eq-description"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="eq-condition"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Condition
            </label>
            <select
              id="eq-condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select condition</option>
              <option value="New">New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={createEquipment.isPending}
            className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {createEquipment.isPending ? "Adding..." : "Add Equipment"}
          </button>
        </form>
      )}

      {isLoading && <p className="text-gray-500">Loading equipment...</p>}

      {error && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700"
        >
          Failed to load equipment.
        </div>
      )}

      {equipment && equipment.length === 0 && (
        <p className="text-gray-500">No equipment registered yet.</p>
      )}

      {equipment && equipment.length > 0 && (
        <div className="space-y-3">
          {equipment.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg p-4 bg-white flex items-start justify-between"
            >
              <div>
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                  {item.condition}
                </span>
              </div>
              <button
                onClick={() => deleteEquipment.mutate(item.id)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
