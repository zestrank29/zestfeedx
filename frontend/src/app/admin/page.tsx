import { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "ZestFeedX Newsroom Admin | Manage, Edit & Delete Posts",
  robots: "noindex, nofollow",
};

export default function AdminHomePage() {
  return <AdminDashboard defaultSection="posts" />;
}
