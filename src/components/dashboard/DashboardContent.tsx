"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  MessageSquare,
  Star,
  Tractor,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent } from "@/components/ui/card";

type DashboardLink = {
  href: string;
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
};

const dashboardLinks: DashboardLink[] = [
  {
    href: "/listings",
    icon: ClipboardList,
    titleKey: "nav.listings",
    descKey: "dashboard.listingsDesc",
  },
  {
    href: "/bookings",
    icon: CalendarCheck,
    titleKey: "nav.bookings",
    descKey: "dashboard.bookingsDesc",
  },
  {
    href: "/payments",
    icon: CreditCard,
    titleKey: "nav.payments",
    descKey: "dashboard.paymentsDesc",
  },
  {
    href: "/messages",
    icon: MessageSquare,
    titleKey: "nav.messages",
    descKey: "dashboard.messagesDesc",
  },
  {
    href: "/equipment",
    icon: Tractor,
    titleKey: "nav.equipment",
    descKey: "dashboard.equipmentDesc",
  },
  {
    href: "/reviews",
    icon: Star,
    titleKey: "nav.reviews",
    descKey: "dashboard.reviewsDesc",
  },
];

export function DashboardContent() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-6 space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t("dashboard.welcome")}
        </h1>
        <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Card className="h-full transition-all group-hover:shadow-md group-hover:ring-primary/40">
                <CardContent className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="flex items-center gap-1 font-semibold text-foreground group-hover:text-primary">
                      {t(link.titleKey)}
                      <ArrowRight
                        className="size-4 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {t(link.descKey)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
