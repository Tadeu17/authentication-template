import { redirect } from "next/navigation";

/**
 * Root page - redirects to login
 * The middleware handles redirecting authenticated users to /dashboard
 */
export default function HomePage() {
  redirect("/login");
}
