import PageBreadcrumb from "@/components/PageBreadCrumb";
import KpiList from "@/components/kpi/KpiList";
import KpiData from "@/components/kpi/KpiData";

import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Form Elements | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function FormElements() {
  return (
    <div>
      <PageBreadcrumb pageTitle="From Elements" />
          <div className="flex flex-col h-full gap-6 sm:gap-5 xl:flex-row">
          <KpiList />
          <KpiData />
        </div>      
    </div>
  );
}
