import React from "react";

import { fetchToAdonis } from "@/lib/auth";

import { PlansPage } from "./_components/PlansPage";

interface ResponseDataType {
  schedules: Array<{
    id: number;
    name: string;
    // Add other fields as necessary
  }>;
}

export default async function Plans() {
  const data = await fetchToAdonis<ResponseDataType>({
    url: "/user/schedules",
    method: "GET",
  });
  console.log("Plans data", data);
  return <PlansPage />;
}
