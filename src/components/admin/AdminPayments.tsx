"use client";

import { Receipt } from "lucide-react";
import { useAdminPayments } from "@/hooks/useAdmin";
import { useTranslation } from "@/hooks/useTranslation";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AdminPayments() {
  const { data: payments, isLoading, error } = useAdminPayments();
  const { t } = useTranslation();

  if (isLoading) return <LoadingState label={t("common.loading")} />;
  if (error) return <ErrorState message={t("admin.loadError")} />;

  return (
    <div>
      <PageHeader title={t("admin.paymentManagement")} />

      {!payments || payments.length === 0 ? (
        <EmptyState icon={Receipt} title={t("common.noResults")} />
      ) : (
        <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>{t("admin.transaction")}</TableHead>
                <TableHead>{t("admin.method")}</TableHead>
                <TableHead>{t("admin.amount")}</TableHead>
                <TableHead>{t("admin.status")}</TableHead>
                <TableHead>{t("admin.date")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-mono text-xs text-foreground">
                    {payment.transactionId ?? payment.id.slice(0, 12)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {payment.paymentMethod}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {payment.amount.toFixed(2)} {payment.currency}
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={payment.status}
                      label={t(`payments.status.${payment.status}`)}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
