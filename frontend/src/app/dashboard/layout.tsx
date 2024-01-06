"use client";

import React from "react";
import { redirect, usePathname } from "next/navigation";
import { CiLogout } from "react-icons/ci";
import { MdManageAccounts } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { TfiWrite } from "react-icons/tfi";
import { useAppContext } from "@/context/AppContext";
import { IconType } from "react-icons";
import DashboardSideBar from "./DashboardSideBar";
import { Helmet } from "react-helmet-async";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export type SidebarLinksType = {
  name: string;
  path: string;
  icon: IconType;
};

const sidebarLinks: SidebarLinksType[] = [
  {
    name: "Profile",
    path: "/dashboard/profile",
    icon: CgProfile,
  },
  {
    name: "Account",
    path: "/dashboard/account",
    icon: MdManageAccounts,
  },
  {
    name: "Requests",
    path: "/dashboard/requests",
    icon: TfiWrite,
  },
  {
    name: "Logout",
    path: "/",
    icon: CiLogout,
  },
];

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();

  const { logout, auth } = useAppContext();

  if (!auth) {
    return redirect("/login");
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
        className="items-center ml-2 flex px-2 py-2 bg-primary w-fit md:hidden"
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
