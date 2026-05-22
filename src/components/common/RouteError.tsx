"use client";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/common/ErrorState";

type RouteErrorProps = {
  /** Resets the error boundary and re-renders the route segment. */
  reset: () => void;
  message?: string;
};

/**
 * Shared UI for App Router `error.tsx` boundaries — a friendly, generic
 * message (raw error details are never shown to the user) plus a retry
 * action that re-runs the failed segment.
 */
export function RouteError({ reset, message }: RouteErrorProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-12">
      <ErrorState
        message={
          message ??
          "Something went wrong while loading this page. Please try again."
        }
      />
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
