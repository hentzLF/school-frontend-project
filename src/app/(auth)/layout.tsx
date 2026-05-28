import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Logo } from "@/components/layout/Logo";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default async function AuthLayout({ children }: AuthLayoutProps) {
  const cookieStore = await cookies();
  if (cookieStore.get("token")) {
    redirect("/dashboard");
  }
  return (
    <div className="flex min-h-svh flex-col bg-muted/30">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="mb-6">
          <Logo href="/" />
        </div>
        <div className="w-full max-w-md">{children}</div>
        <p className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} AgriMarket · TalTech HTIITS
        </p>
      </div>
    </div>
  );
}
