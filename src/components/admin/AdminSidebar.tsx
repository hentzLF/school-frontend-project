"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  CalendarCheck,
  Tags,
  CreditCard,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

type AdminLink = {
  href: string;
  key: string;
  icon: LucideIcon;
};

const adminLinks: AdminLink[] = [
  { href: "/admin", key: "admin.overview", icon: LayoutDashboard },
  { href: "/admin/users", key: "admin.users", icon: Users },
  { href: "/admin/listings", key: "admin.listings", icon: ClipboardList },
  { href: "/admin/bookings", key: "admin.bookings", icon: CalendarCheck },
  { href: "/admin/categories", key: "admin.categories", icon: Tags },
  { href: "/admin/payments", key: "admin.payments", icon: CreditCard },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside className="border-b bg-card md:w-60 md:shrink-0 md:border-r md:border-b-0">
      <nav
        aria-label="Admin navigation"
        className="flex gap-1 overflow-x-auto p-3 md:flex-col md:p-4"
      >
        <p className="hidden px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:block">
          {t("admin.title")}
        </p>
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {t(link.key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
