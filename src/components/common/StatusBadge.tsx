import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  Pending:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Confirmed:
    "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  InProgress:
    "border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
  Completed: "border-primary/30 bg-primary/10 text-primary",
  Active: "border-primary/30 bg-primary/10 text-primary",
  Cancelled: "border-destructive/30 bg-destructive/10 text-destructive",
  Failed: "border-destructive/30 bg-destructive/10 text-destructive",
  Refunded: "border-border bg-muted text-muted-foreground",
  Inactive: "border-border bg-muted text-muted-foreground",
};

type StatusBadgeProps = {
  status: string;
  label: string;
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("border", tones[status] ?? tones.Refunded)}
    >
      {label}
    </Badge>
  );
}
