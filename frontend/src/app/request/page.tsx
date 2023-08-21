"use client";

import { useAppContext } from "@/context/AppContext";
import { redirect } from "next/navigation";
import React from "react";
import { Helmet } from "react-helmet";

const RequestPage = () => {
  const { auth } = useAppContext();
  if (!auth?.email) {
    return redirect("/login");
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Design Your Request | PTM</title>
        <meta
          name="description"
          content="Design your perfect proposal request"
        />
      </Helmet>
      <div>Request page</div>
    </>
  );
};

export default RequestPage;
