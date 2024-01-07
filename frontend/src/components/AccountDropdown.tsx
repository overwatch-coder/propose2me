import { sidebarLinks } from "@/app/dashboard/layout";
import Link from "next/link";
import React from "react";
import { CiLogout } from "react-icons/ci";
import { MdManageAccounts } from "react-icons/md";
import { VscClose } from "react-icons/vsc";

type AccountDropdownProps = {
  setShowAccountDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  showAccountDropdown: boolean;
  logout: () => void;
};

const AccountDropdown = ({
  showAccountDropdown,
  setShowAccountDropdown,
  logout,
}: AccountDropdownProps) => {
  return (
    <div
      className={`absolute md:top-16 right-0 px-7 py-7 w-fit duration-700 bg-primary-main text-white ${
        showAccountDropdown
          ? "translate-y-0 transition"
          : "transition -translate-y-[9999px]"
      }`}
    >
      <h3 className="pb-2 underline font-semibold text-base flex flex-row items-center justify-between">
        <span></span>
        <VscClose
          onClick={() => {
            setShowAccountDropdown(false);
          }}
          size={22}
          className="text-primary-main w-5 h-5 rounded-full bg-white border-white border cursor-pointer hover:text-white hover:bg-transparent"
        />
      </h3>

      <div className="flex flex-col space-y-5">
        {sidebarLinks.map(
          (accountLink, idx) =>
            accountLink.name !== "Logout" && (
              <Link
                key={idx}
                className="flex items-center py-2 px-3 bg-white rounded text-primary-main text-center"
                href={accountLink.path}
              >
                <accountLink.icon size={25} />
                <span className="mx-2 text-primary-main font-medium uppercase">
                  {accountLink.name}
                </span>
              </Link>
            )
        )}

        <button
          className="items-center flex px-3 py-2 bg-white text-primary-main rounded text-center"
          onClick={logout}
        >
          <CiLogout size={25} />
          <span className="mx-2 text-primary-main font-medium uppercase">
            {"Logout"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default AccountDropdown;
