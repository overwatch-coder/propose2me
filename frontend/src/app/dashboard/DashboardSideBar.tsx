import Link from "next/link";
import React from "react";
import { SidebarLinksType } from "./layout";

type SidebarProps = {
  pathname: string;
  sidebarLinks: SidebarLinksType[];
  logout: () => void;
};

const DashboardSideBar = ({ pathname, sidebarLinks, logout }: SidebarProps) => {
  return (
    <section className="md:relative w-fit mx-auto md:w-44 md:h-screen bg-secondary dark:bg-primary flex md:flex-col shadow-xl rounded">
      {sidebarLinks.map((sbLink, index: number) => (
        <div key={index}>
          {sbLink.name !== "Logout" ? (
            <Link
              key={index}
              href={sbLink.path}
              className={`md:py-4 py-2 px-2 hover:bg-primary hover:text-white dark:hover:bg-secondary dark:hover:text-white border dark:border-secondary flex items-center ${
                sbLink.path === pathname
                  ? "dark:bg-secondary bg-primary dark:text-white text-white"
                  : "text-white"
              }`}
            >
              <sbLink.icon color={"white"} size={22} />
              <span className="mx-2">{sbLink.name}</span>
            </Link>
          ) : (
            <button
              key={index}
              className="items-center hidden md:flex px-2 md:py-3 py-2 dark:bg-secondary bg-primary absolute bottom-0 border-t-2 border-t-secondary md:bottom-0 w-fit md:w-full left-0 md:left-auto"
              onClick={logout}
            >
              <sbLink.icon color={"white"} size={22} />
              <span className="mx-2 text-white font-medium">{sbLink.name}</span>
            </button>
          )}
        </div>
      ))}
    </section>
  );
};

export default DashboardSideBar;
