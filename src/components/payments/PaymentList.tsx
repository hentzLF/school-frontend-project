"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Receipt } from "lucide-react";
import { usePayments, useCreatePayment } from "@/hooks/usePayments";
import { useTranslation } from "@/hooks/useTranslation";
import { PageHeader } from "@/components/common/PageHeader";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { FormAlert } from "@/components/common/FormAlert";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PaymentList() {
  const { data: payments, isLoading, error } = usePayments();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const createPayment = useCreatePayment();
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");

  const methodLabels: Record<string, string> = {
    bank_transfer: t("payments.bankTransfer"),
    credit_card: t("payments.creditCard"),
    cash: t("payments.cash"),
  };

  const handleCreatePayment = async () => {
    if (!bookingId) return;
    try {
      await createPayment.mutateAsync({ bookingId, paymentMethod });
    } catch {
      // Error captured by mutation
    }
  };

  return (
    <div>
      <PageHeader title={t("payments.title")} />

      {bookingId && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {t("payments.processPayment")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {createPayment.error && (
              <FormAlert message={t("payments.paymentFailed")} />
            )}
            <div className="flex flex-wrap items-end gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="paymentMethod">
                  {t("payments.paymentMethod")}
                </Label>
                <Select
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setPaymentMethod(value ?? "bank_transfer")
                  }
                >
                  <SelectTrigger id="paymentMethod" className="w-52">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">
                      {t("payments.bankTransfer")}
                    </SelectItem>
                    <SelectItem value="credit_card">
                      {t("payments.creditCard")}
                    </SelectItem>
                    <SelectItem value="cash">{t("payments.cash")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleCreatePayment}
                disabled={createPayment.isPending}
              >
                {createPayment.isPending
                  ? t("payments.processing")
                  : t("payments.payNow")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && <LoadingState label={t("common.loading")} />}

      {error && <ErrorState message={t("payments.loadError")} />}

      {payments && payments.length === 0 && (
        <EmptyState icon={Receipt} title={t("payments.noPayments")} />
      )}

      {payments && payments.length > 0 && (
        <div className="space-y-3">
          {payments.map((payment) => (
            <Card key={payment.id} size="sm">
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {t("payments.booking")}: {payment.bookingId.slice(0, 8)}…
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {methodLabels[payment.paymentMethod] ??
                      payment.paymentMethod}{" "}
                    · {new Date(payment.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge
                    status={payment.status}
                    label={t(`payments.status.${payment.status}`)}
                  />
                  <span className="text-sm font-bold text-foreground">
                    {payment.amount.toFixed(2)} {payment.currency}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
