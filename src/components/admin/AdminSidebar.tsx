"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/listings", label: "Listings" },
  { href: "/admin/bookings", label: "Bookings" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/payments", label: "Payments" },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 border-r border-gray-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Admin
      </h2>
      <nav className="space-y-1">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 text-sm rounded-md ${
                isActive
                  ? "bg-green-50 text-green-700 font-medium"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
