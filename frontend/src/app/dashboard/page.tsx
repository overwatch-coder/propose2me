"use client";
import { redirect, usePathname } from "next/navigation";

const DashboardPage = () => {
  const pathname = usePathname();

  if (pathname === "/dashboard") {
    return redirect("/dashboard/profile");
  }
};

export default DashboardPage;
