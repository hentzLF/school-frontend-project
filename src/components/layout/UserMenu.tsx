"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  const initials =
    `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="h-9 gap-2 px-1.5"
            aria-label={t("nav.account")}
          />
        }
      >
        <Avatar size="sm">
          <AvatarFallback className="bg-primary/10 font-medium text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium sm:inline">
          {user.firstName}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <div className="flex flex-col gap-0.5 px-1.5 py-1.5">
          <span className="text-xs text-muted-foreground">
            {t("nav.signedInAs")}
          </span>
          <span className="text-sm font-medium text-foreground">
            {user.firstName} {user.lastName}
          </span>
          <span className="truncate text-xs text-muted-foreground">
            {user.email}
          </span>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/dashboard" />}>
          <LayoutDashboard aria-hidden="true" />
          {t("nav.dashboard")}
        </DropdownMenuItem>
        {user.role === "Admin" && (
          <DropdownMenuItem render={<Link href="/admin" />}>
            <ShieldCheck aria-hidden="true" />
            {t("nav.admin")}
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => void logout()}>
          <LogOut aria-hidden="true" />
          {t("auth.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
