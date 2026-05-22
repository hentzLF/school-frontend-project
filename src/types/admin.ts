export type AdminDashboard = {
  totalUsers: number;
  totalListings: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: number;
  activeListings: number;
};

export type AdminUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "Client" | "Provider" | "Admin";
  createdAt: string;
  isActive: boolean;
};

export type UpdateUserRoleRequest = {
  role: "Client" | "Provider" | "Admin";
};
