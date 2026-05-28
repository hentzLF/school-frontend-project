import { CircleAlert, CircleCheck } from "lucide-react";

type FormAlertProps = {
  message: string;
  variant?: "error" | "success";
};

export function FormAlert({ message, variant = "error" }: FormAlertProps) {
  if (variant === "success") {
    return (
      <div
        role="status"
        className="flex items-start gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2.5 text-sm text-green-700 dark:text-green-400"
      >
        <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
