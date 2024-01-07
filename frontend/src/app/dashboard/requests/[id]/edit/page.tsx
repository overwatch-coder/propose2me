import { cookies } from "next/headers";
import React from "react";
import { getSpecificRequest } from "@/app/actions/request.action";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";
import RequestEditForm from "./RequestEditForm";

const EditRequestPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const cookieList = cookies();
  const token = cookieList.get("access_token");
  const userRequestData = await getSpecificRequest(token?.value!, id);

  if (!userRequestData.success) {
    toast.error(userRequestData.message);
    redirect("/dashboard/requests");
  }

  return (
    <section className="flex flex-col space-y-2">
      <RequestEditForm userRequestData={userRequestData.requests!} />
    </section>
  );
};

export default EditRequestPage;
