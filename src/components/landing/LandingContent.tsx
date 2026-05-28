"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  Star,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Logo } from "@/components/layout/Logo";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Feature = {
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
};

const features: Feature[] = [
  {
    icon: ClipboardList,
    titleKey: "landing.feature1Title",
    descKey: "landing.feature1Desc",
  },
  {
    icon: CalendarCheck,
    titleKey: "landing.feature2Title",
    descKey: "landing.feature2Desc",
  },
  {
    icon: Star,
    titleKey: "landing.feature3Title",
    descKey: "landing.feature3Desc",
  },
];

export function LandingContent() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Logo href="/" />
            <Link
              href="/listings"
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:block"
            >
              {t("nav.listings")}
            </Link>
          </div>
          <div className="flex items-center gap-1.5">
            <LocaleSwitcher />
            <ThemeToggle />
            <Button
              nativeButton={false} render={<Link href="/login" />}
              variant="outline"
              className="ml-1"
            >
              {t("landing.signIn")}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <span className="inline-flex items-center rounded-full border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            {t("landing.badge")}
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t("landing.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            {t("landing.subtitle")}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              nativeButton={false} render={<Link href="/listings" />}
              size="lg"
              className="h-11 w-full px-6 text-base sm:w-auto"
            >
              {t("landing.getStarted")}
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button
              nativeButton={false} render={<Link href="/login" />}
              variant="outline"
              size="lg"
              className="h-11 w-full px-6 text-base sm:w-auto"
            >
              {t("landing.signIn")}
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.titleKey}>
                  <CardContent className="space-y-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="font-semibold text-foreground">
                        {t(feature.titleKey)}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {t(feature.descKey)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} AgriMarket · TalTech HTIITS course
          project
        </div>
      </footer>
    </div>
  );
}
