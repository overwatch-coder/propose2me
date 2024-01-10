"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/password-reset";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import Swal from "sweetalert2";

type DataType = {
  success: boolean;
  message: string;
};

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const verification = searchParams.get("verification") || null;

  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const [data, setData] = useState<DataType>({ success: false, message: "" });
  const [loading, setLoading] = useState(false);

  if (!verification) {
    return router.push("/login");
  }

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setData({ success: false, message: "" });
    const formData = new FormData(e.currentTarget);
    const results: DataType = await resetPassword(formData);

    console.log({ results });

    setLoading(false);
    if (!results.success) {
      Swal.fire({
        title: "An error occurred",
        text: results.message,
        icon: "error",
        showConfirmButton: false,
      });

      setTimeout(() => {
        Swal.close();
        setPasswords((prev) => ({ ...prev, confirmPassword: "" }));
      }, 3000);

      return;
    }

    setPasswords({ password: "", confirmPassword: "" });
    setData({ success: results.success, message: results.message });
    deleteSearchParams("verification");
    setTimeout(() => {
      setData({ success: false, message: "" });
      router.push("/login");
    }, 4000);
  };

  //   delete the query parameters in the url after verification
  const deleteSearchParams = (query: string) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.searchParams);
    params.set(query, "");
    params.delete(query);
  };

  return (
    <Dialog open={true} modal={true}>
      <DialogContent className="sm:max-w-[425px] flex flex-col space-y-4 z-50">
        <DialogHeader>
          <DialogTitle className="font-semibold">
            Reset Account Password
          </DialogTitle>
          <DialogDescription>
            Choose a new password for your account.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleResetPassword}
          className="flex flex-col space-y-6"
        >
          {data.success && (
            <small className="text-green-700 text-sm">{data.message}</small>
          )}

          <div className="flex flex-col space-y-3">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              className="rounded w-full"
              required
              name="password"
              type="password"
              value={passwords.password}
              onChange={(e) =>
                setPasswords((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </div>

          <input
            id="verification"
            className="rounded w-full"
            name="verification"
            hidden={true}
            type="text"
            value={verification}
          />

          <div className="flex flex-col space-y-3">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              className="rounded w-full"
              name="confirmPassword"
              required
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
            />
          </div>

          <button
            disabled={loading}
            aria-disabled={loading}
            type="submit"
            className="text-center w-full hover:bg-primary-main py-2 hover:text-white border-primary-main  rounded border bg-transparent text-primary-main"
          >
            {loading ? "Confirming..." : "Confirm"}
          </button>
        </form>

        <Link href={"/login"} className="underline text-center mx-auto">
          Back to login
        </Link>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPassword;
