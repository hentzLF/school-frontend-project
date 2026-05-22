"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/hooks/useTranslation";
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher";
import { ApiError } from "@/lib/api";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login, loginError, isLoginPending } = useAuth();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      router.push("/dashboard");
    } catch {
      // Error is captured by loginError from useAuth
    }
  };

  const apiErrorMessage =
    loginError instanceof ApiError
      ? loginError.message
      : loginError
        ? t("auth.unexpectedError")
        : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex justify-end mb-4">
        <LocaleSwitcher />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        {t("auth.signIn")}
      </h1>

      {apiErrorMessage && (
        <div
          role="alert"
          className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-700 text-sm"
        >
          {apiErrorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("auth.email")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("auth.password")}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p id="password-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoginPending}
          className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoginPending ? t("auth.signingIn") : t("auth.signInLink")}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {t("auth.noAccount")}{" "}
        <Link href="/register" className="text-green-600 hover:text-green-700 font-medium">
          {t("auth.register")}
        </Link>
      </p>
    </div>
  );
}
