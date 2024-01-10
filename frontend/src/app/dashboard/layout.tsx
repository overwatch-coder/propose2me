"use client";

import React from "react";
import { redirect, usePathname } from "next/navigation";
import { CiLogout } from "react-icons/ci";
import { useAppContext } from "@/context/AppContext";
import DashboardSideBar from "./DashboardSideBar";
import { Helmet } from "react-helmet-async";
import { sidebarLinks } from "@/constants";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();

  const { logout, auth } = useAppContext();

  if (!auth) {
    return redirect("/login?redirect=/dashboard/profile");
  }

  return (
    <div className="flex flex-col md:flex-row md:justify-between w-full space-y-5 md:space-y-0">
      <Helmet>
        <title>
          {pathname.split("/")[1]} | {pathname.split("/")[2]}
        </title>
      </Helmet>

      <DashboardSideBar
        pathname={pathname}
        sidebarLinks={sidebarLinks}
        logout={logout}
      />

      <button
        className="items-center ml-2 flex px-2 py-2 bg-primary-main w-fit md:hidden"
        onClick={logout}
      >
        <CiLogout color={"white"} size={22} />
        <span className="mx-2 text-white font-medium">{"Logout"}</span>
      </button>

      <section className="flex-1 md:ml-10 mt-7 md:mt-0 p-4 dark:text-white text-black">
        {children}
      </section>
    </div>
  );
};

export default DashboardLayout;
