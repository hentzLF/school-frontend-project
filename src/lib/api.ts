import { redirectToLogin } from "@/lib/navigation";

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export async function api<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const config: RequestInit = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(endpoint, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));

    // A 401 here means the server-side token refresh also failed — the
    // session is genuinely over, so send the user to the login page.
    if (response.status === 401) {
      redirectToLogin();
    }

    throw new ApiError(response.status, error.message ?? "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
