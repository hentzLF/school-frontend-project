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

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    role: z.enum(["Client", "Provider"], {
      error: "Please select a role",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, registerError, isRegisterPending } = useAuth();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      router.push("/dashboard");
    } catch {
      // Error is captured by registerError from useAuth
    }
  };

  const apiErrorMessage =
    registerError instanceof ApiError
      ? registerError.message
      : registerError
        ? t("auth.unexpectedError")
        : null;

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex justify-end mb-4">
        <LocaleSwitcher />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        {t("auth.createAccount")}
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("auth.firstName")}
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              {...register("firstName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "firstName-error" : undefined}
            />
            {errors.firstName && (
              <p id="firstName-error" role="alert" className="mt-1 text-xs text-red-600">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t("auth.lastName")}
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              {...register("lastName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              aria-invalid={!!errors.lastName}
              aria-describedby={errors.lastName ? "lastName-error" : undefined}
            />
            {errors.lastName && (
              <p id="lastName-error" role="alert" className="mt-1 text-xs text-red-600">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

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
            autoComplete="new-password"
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

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("auth.confirmPassword")}
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
          />
          {errors.confirmPassword && (
            <p id="confirmPassword-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("auth.role")}
          </label>
          <select
            id="role"
            {...register("role")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            aria-invalid={!!errors.role}
            aria-describedby={errors.role ? "role-error" : undefined}
          >
            <option value="">{t("auth.roleRequired")}</option>
            <option value="Client">{t("auth.roleClient")}</option>
            <option value="Provider">{t("auth.roleProvider")}</option>
          </select>
          {errors.role && (
            <p id="role-error" role="alert" className="mt-1 text-xs text-red-600">
              {errors.role.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isRegisterPending}
          className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRegisterPending ? t("auth.creatingAccount") : t("auth.createAccount")}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        {t("auth.haveAccount")}{" "}
        <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
          {t("auth.signInLink")}
        </Link>
      </p>
    </div>
  );
}
