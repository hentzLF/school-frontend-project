"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

const dashboardLinks = [
  { href: "/listings", titleKey: "nav.listings", descKey: "dashboard.listingsDesc" },
  { href: "/bookings", titleKey: "nav.bookings", descKey: "dashboard.bookingsDesc" },
  { href: "/payments", titleKey: "nav.payments", descKey: "dashboard.paymentsDesc" },
  { href: "/messages", titleKey: "nav.messages", descKey: "dashboard.messagesDesc" },
  { href: "/equipment", titleKey: "nav.equipment", descKey: "dashboard.equipmentDesc" },
  { href: "/reviews", titleKey: "nav.reviews", descKey: "dashboard.reviewsDesc" },
] as const;

export function DashboardContent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">{t("dashboard.welcome")}</h1>
      <p className="mt-2 text-gray-600 mb-8">{t("dashboard.subtitle")}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{t(link.titleKey)}</h2>
            <p className="text-sm text-gray-500">{t(link.descKey)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
