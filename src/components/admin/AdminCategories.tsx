"use client";

import { useState } from "react";
import { useAdminCategories, useCreateCategory, useDeleteCategory } from "@/hooks/useAdmin";

export function AdminCategories() {
  const { data: categories, isLoading, error } = useAdminCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
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

  if (isLoading) return <p className="text-gray-500">Loading categories...</p>;
  if (error) {
    return (
      <div role="alert" className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        Failed to load categories.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Category Management</h1>

      <form onSubmit={handleCreate} className="mb-6 flex gap-3 items-end">
        <div>
          <label htmlFor="cat-name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            id="cat-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label htmlFor="cat-desc" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            id="cat-desc"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <button
          type="submit"
          disabled={createCategory.isPending}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {!categories || categories.length === 0 ? (
        <p className="text-gray-500">No categories yet.</p>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{category.name}</p>
                {category.description && (
                  <p className="text-sm text-gray-500">{category.description}</p>
                )}
              </div>
              <button
                onClick={() => deleteCategory.mutate(category.id)}
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
