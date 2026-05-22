"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";

const navKeys = [
  { href: "/dashboard", key: "nav.dashboard" },
  { href: "/listings", key: "nav.listings" },
  { href: "/bookings", key: "nav.bookings" },
  { href: "/messages", key: "nav.messages" },
  { href: "/equipment", key: "nav.equipment" },
] as const;

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-xl font-bold text-green-700 hover:text-green-800"
          >
            AgriMarket
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navKeys.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? "bg-green-50 text-green-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {t(link.key)}
                </Link>
              );
            })}
            {user?.role === "Admin" && (
              <Link
                href="/admin"
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  pathname.startsWith("/admin")
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {t("nav.admin")}
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          {user && (
            <span className="text-sm text-gray-600">
              {user.firstName} {user.lastName}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {t("auth.signOut")}
          </button>
        </div>
      </div>
    </header>
  );
}
