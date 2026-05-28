"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Logo } from "@/components/layout/Logo";
import { UserMenu } from "@/components/layout/UserMenu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

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

  const links = [
    ...navKeys,
    ...(user?.role === "Admin"
      ? ([{ href: "/admin", key: "nav.admin" }] as const)
      : []),
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Logo href="/dashboard" />
          <nav
            className="hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
          <LocaleSwitcher />
          <ThemeToggle />
          <UserMenu />
          <Button
            variant="ghost"
            className="hidden gap-2 md:inline-flex"
            onClick={() => void logout()}
          >
            <LogOut aria-hidden="true" />
            {t("auth.signOut")}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label={t("nav.openMenu")}
                />
              }
            >
              <Menu aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {links.map((link) => (
                <DropdownMenuItem
                  key={link.href}
                  render={<Link href={link.href} prefetch={false} />}
                >
                  {t(link.key)}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={() => void logout()}>
                <LogOut aria-hidden="true" />
                {t("auth.signOut")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
