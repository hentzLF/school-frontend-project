import { TriangleAlert } from "lucide-react";

type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
    >
      <TriangleAlert className="size-5 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
