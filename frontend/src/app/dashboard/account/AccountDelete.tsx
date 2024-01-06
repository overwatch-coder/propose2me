"use client";

import { deleteUserAccount } from "@/app/actions/user-data";
import { useAppContext } from "@/context/AppContext";
import { redirect } from "next/navigation";
import Swal from "sweetalert2";

const AccountDelete = () => {
  const { auth, logout } = useAppContext();

  const handleDeleteButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#008000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const data = await deleteUserAccount(auth?.token!, auth?.id!);

        if (!data?.success) {
          Swal.fire({
            title: "Oops. Something went wrong",
            text: data?.message,
            icon: "error",
          });
        } else {
          Swal.fire({
            title: "Deleted!",
            text: data?.message,
            icon: "success",
          });
          logout();
        }
      }
    });
  };

  return (
    <section className="shadow-md border-red-600 rounded border p-4 flex flex-col space-y-5">
      <h2 className="font-semibold text-lg text-red-600">Danger Zone</h2>

      <div className="flex flex-col space-y-5 md:space-y-0 md:items-center md:justify-between md:flex-row">
        <div className="flex flex-col space-y-1">
          <h2>Delete your account</h2>
          <span className="text-xs dark:text-white/70">
            Once you delete your account, there is no going back. <br />
            You will lose any unreplied requests created. Please be certain!
          </span>
        </div>

        <button
          onClick={handleDeleteButtonClick}
          className="rounded px-4 py-2 border-red-500 border hover:bg-red-600 text-red-500 hover:text-white md:w-fit"
        >
          Delete this account
        </button>
      </div>
    </section>
  );
};

export default AccountDelete;
