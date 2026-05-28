"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { AUTH_ROUTES } from "@/config/constants";
import type { User, LoginRequest, RegisterRequest } from "@/types/auth";

type MeResponse = User;

type AuthMutationResponse = {
  user: User;
};

type UseAuthReturn = {
  user: User | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loginError: ApiError | Error | null;
  registerError: ApiError | Error | null;
  isLoginPending: boolean;
  isRegisterPending: boolean;
};

export function useAuth(): UseAuthReturn {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user, isLoading } = useQuery<MeResponse | null>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        return await api<MeResponse>(AUTH_ROUTES.me, {
          redirectOn401: false,
        });
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          return null;
        }
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const loginMutation = useMutation<AuthMutationResponse, Error, LoginRequest>({
    mutationFn: (data: LoginRequest) =>
      api<AuthMutationResponse>(AUTH_ROUTES.login, {
        method: "POST",
        body: data,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const registerMutation = useMutation<unknown, Error, RegisterRequest>({
    mutationFn: (data: RegisterRequest) =>
      api<unknown>(AUTH_ROUTES.register, {
        method: "POST",
        body: data,
      }),
  });

  const logoutMutation = useMutation<void, Error, void>({
    mutationFn: () => api<void>(AUTH_ROUTES.logout, { method: "POST" }),
    onSuccess: () => {
      queryClient.clear();
      router.push("/login");
    },
  });

  const login = async (data: LoginRequest): Promise<void> => {
    await loginMutation.mutateAsync(data);
  };

  const register = async (data: RegisterRequest): Promise<void> => {
    await registerMutation.mutateAsync(data);
  };

  const logout = async (): Promise<void> => {
    await logoutMutation.mutateAsync();
  };

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isLoginPending: loginMutation.isPending,
    isRegisterPending: registerMutation.isPending,
  };
}
