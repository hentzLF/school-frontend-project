"use client";

import { RouteError } from "@/components/common/RouteError";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ reset }: ErrorProps) {
  return <RouteError reset={reset} />;
}
