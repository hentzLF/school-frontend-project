import Link from "next/link";

const dashboardLinks = [
  { href: "/listings", title: "Listings", description: "Browse and create service listings" },
  { href: "/bookings", title: "Bookings", description: "View and manage your bookings" },
  { href: "/payments", title: "Payments", description: "Payment history and processing" },
  { href: "/messages", title: "Messages", description: "Conversations with clients and providers" },
  { href: "/equipment", title: "Equipment", description: "Manage your equipment inventory" },
  { href: "/reviews", title: "Reviews", description: "Read and write service reviews" },
] as const;

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Welcome to AgriMarket</h1>
      <p className="mt-2 text-gray-600 mb-8">
        Your agricultural service marketplace dashboard.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dashboardLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{link.title}</h2>
            <p className="text-sm text-gray-500">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
