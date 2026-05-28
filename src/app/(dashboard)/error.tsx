"use client";

import { useEffect } from "react";
import { RouteError } from "@/components/common/RouteError";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[DashboardError boundary]", error);
  }, [error]);

  return <RouteError reset={reset} />;
}
