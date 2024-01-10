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
import { requestPasswordReset } from "@/lib/password-reset";
import Link from "next/link";
import React, { useState } from "react";
import Swal from "sweetalert2";

type DataType = {
  success: boolean;
  message: string;
};

const ForgotPassword = () => {
  const [data, setData] = useState<DataType>({ success: false, message: "" });
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRequestPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setData({ success: false, message: "" });

    const formData = new FormData(e.currentTarget);
    const results: DataType = await requestPasswordReset(formData);

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
      }, 3000);
      return;
    }

    setEmail("");
    setData({ success: results.success, message: results.message });
    setTimeout(() => {
      setData({ success: false, message: "" });
    }, 4000);
  };

  return (
    <Dialog open={true} modal={true}>
      <DialogContent className="sm:max-w-[425px] flex flex-col space-y-4 z-50">
        <DialogHeader>
          <DialogTitle className="font-semibold">
            Forgot your password?
          </DialogTitle>
          <DialogDescription>
            Please enter the email you use to sign in to PTM.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleRequestPassword}
          className="flex flex-col space-y-5"
        >
          <Label htmlFor="email">Email address</Label>
          {data.success && (
            <small className="text-green-700 text-sm">{data.message}</small>
          )}

          <Input
            id="email"
            className="rounded w-full"
            placeholder="user@ptm.com"
            name="email"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            disabled={loading}
            aria-disabled={loading}
            type="submit"
            className="text-center w-full hover:bg-primary-main py-2 hover:text-white border-primary-main  rounded border bg-transparent text-primary-main"
          >
            {loading ? "Requesting..." : "Request password reset"}
          </button>
        </form>

        <Link href={"/login"} className="underline text-center mx-auto">
          Back to login
        </Link>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPassword;
