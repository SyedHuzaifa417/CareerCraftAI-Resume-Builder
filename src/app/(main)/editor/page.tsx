import { Metadata } from "next";
import React from "react";
import ResumeEditor from "./ResumeEditor";

export const metadata: Metadata = {
  title: "New Resume",
};
const Page = () => {
  return <ResumeEditor />;
};

export default Page;
