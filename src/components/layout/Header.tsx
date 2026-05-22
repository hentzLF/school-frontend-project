"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <Link
        href="/dashboard"
        className="text-xl font-bold text-green-700 hover:text-green-800"
      >
        AgriMarket
      </Link>
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Log out
      </button>
    </header>
  );
}
