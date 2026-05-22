export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "Client" | "Provider" | "Admin";
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "Client" | "Provider";
};

export type AuthResponse = {
  token: string;
  refreshToken: string;
  user: User;
};
