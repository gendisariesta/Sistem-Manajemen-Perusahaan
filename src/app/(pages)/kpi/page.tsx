import PageBreadcrumb from "@/components/PageBreadCrumb";
import KpiList from "@/components/kpi/KpiList";
import KpiData from "@/components/kpi/KpiData";
import KpiDetail from "@/components/kpi/KpiDetail";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "KPI Divisi | Goolaya Company",
  description:
    "Halaman KPI untuk Divisi Goolaya Company",
};

export default async function KpiDivisi() {
  const [resDiv, resKpi, resKpiUser, resUser] = await Promise.all([
    fetch(`${process.env.API_URL}/divisi`, {cache:"no-store"}),
    fetch(`${process.env.API_URL}/kpi`, {cache:"no-store"}),
    fetch(`${process.env.API_URL}/kpi_user`, {cache:"no-store"}),
    fetch(`${process.env.API_URL}/users`, {cache:"no-store"}),
  ]);
  const [resultDiv, resultKpi, resultKpiUser, resultUser] = await Promise.all([
    resDiv.json(),
    resKpi.json(),
    resKpiUser.json(),
    resUser.json(),
  ]);
  const dataDivisi = resultDiv.data;
  const dataKpi = resultKpi.data;
  const dataKpiUser = resultKpiUser.data;
  const dataUser = resultUser.data;

  return (
    <div>
      <PageBreadcrumb pageTitle="From Elements" />
      <div className="flex flex-col h-full gap-6 sm:gap-5 xl:flex-row mb-5">
        <KpiList data={dataDivisi} />
        <KpiData dataKpi={dataKpi} dataUser={dataUser} />
      </div>
      <KpiDetail dataKpi={dataKpi} dataUser={dataUser} dataKpiUser={dataKpiUser}/>
    </div>
  );
}
