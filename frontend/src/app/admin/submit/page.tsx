import { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Submit News & Guest Posts | ZestFeedX Admin",
  robots: "noindex, nofollow",
};

export default function AdminSubmitPage() {
  return <AdminDashboard defaultSection="new" />;
}
