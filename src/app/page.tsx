import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LandingContent } from "@/components/landing/LandingContent";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    redirect("/dashboard");
  }

  return <LandingContent />;
}
