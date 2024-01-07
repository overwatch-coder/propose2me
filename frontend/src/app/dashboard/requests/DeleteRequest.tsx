"use client";

import React, { useState } from "react";
import { IUrls } from "../../../../types";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { deleteRequest } from "@/lib/request";

type DeleteRequestProps = {
  token: string;
  id: string;
  urlId: string;
  setUrls: React.Dispatch<React.SetStateAction<IUrls[]>>;
};

const DeleteRequest = ({ token, id, urlId, setUrls }: DeleteRequestProps) => {
  const [loading, setLoading] = useState(false);

  const deleteUserRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = await deleteRequest(id, token);

    if (!data.success) {
      setLoading(false);

      Swal.fire({
        title: "Oops. Something went wrong",
        text: data?.message,
        icon: "error",
      });
      return;
    }

    setLoading(false);
    setUrls((prevUlr) => prevUlr.filter((url) => url._id !== urlId));
    Swal.fire({
      title: "Deleted!",
      text: data?.message,
      icon: "success",
    });
  };

  return (
    <form onSubmit={deleteUserRequest}>
      <button
        type="submit"
        className="bg-red-700 text-xs rounded text-white text-center px-3 py-1 w-full"
      >
        {loading ? "Deleting..." : "Delete"}
      </button>
    </form>
  );
};

export default DeleteRequest;
