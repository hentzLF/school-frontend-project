"use client";

import {
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  LayoutList,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { useAdminDashboard } from "@/hooks/useAdmin";
import { useTranslation } from "@/hooks/useTranslation";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { Card, CardContent } from "@/components/ui/card";

type Stat = {
  label: string;
  value: string | number;
  icon: LucideIcon;
};

export function AdminDashboard() {
  const { data, isLoading, error } = useAdminDashboard();
  const { t } = useTranslation();

  if (isLoading) return <LoadingState label={t("common.loading")} />;
  if (error) return <ErrorState message={t("admin.loadError")} />;
  if (!data) return null;

  const stats: Stat[] = [
    { label: t("admin.totalUsers"), value: data.totalUsers, icon: Users },
    {
      label: t("admin.activeListings"),
      value: data.activeListings,
      icon: ClipboardList,
    },
    {
      label: t("admin.totalBookings"),
      value: data.totalBookings,
      icon: CalendarCheck,
    },
    {
      label: t("admin.recentBookings"),
      value: data.recentBookings,
      icon: CalendarClock,
    },
    {
      label: t("admin.totalRevenue"),
      value: `${data.totalRevenue.toFixed(2)} EUR`,
      icon: Wallet,
    },
    {
      label: t("admin.totalListings"),
      value: data.totalListings,
      icon: LayoutList,
    },
  ];

  return (
    <div>
      <PageHeader title={t("admin.dashboard")} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
