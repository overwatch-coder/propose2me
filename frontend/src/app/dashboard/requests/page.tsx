import React from "react";
import RequestsDisplay from "./RequestsDisplay";

const RequestsPage = async () => {
  return (
    <section className="flex flex-col space-y-4">
      <div className="shadow-md rounded p-4">
        <h2 className="font-semibold font-nunito md:text-2xl text-center">
          Manage Your Requests
        </h2>
      </div>

      <div className="shadow-md dark:border-white border-secondary-main rounded border p-4 flex flex-col space-y-10 mb-auto">
        <RequestsDisplay />
      </div>
    </section>
  );
};

export default RequestsPage;
