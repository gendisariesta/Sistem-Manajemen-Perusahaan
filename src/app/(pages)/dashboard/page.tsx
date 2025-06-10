import type { Metadata } from "next";
import React from "react";
import PresensiButtonCard from "@/components/PresensiButtonCard";
import PresensiListCard from "@/components/PresensiListCard";
import TaskSummaryCard from "@/components/TaskSummaryCard";
import EmployeeActivities from "@/components/EmployeeActivities"
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Halaman Dashboard | Goolaya Company",
};
export default async function Dashboard() {
  const cookieStore = cookies();
  const resUser = await fetch(`${process.env.API_URL}/auth`, {
    headers: {Cookie: cookieStore.toString()},
    cache: 'no-store',
  });
  const resultUser = await resUser.json();
  const dataUser = resultUser.user;
  const [resPresensi, resTugas] = await Promise.all([
    fetch(`${process.env.API_URL}/kehadiran?id_user=${dataUser.uid}`,{cache:'no-store'}),
    fetch(`${process.env.API_URL}/tugas?assign_to_id=${dataUser.uid}`,{cache:'no-store'}),
  ]);
  const [resultPresensi, resultTugas] = await Promise.all([
    resPresensi.json(),
    resTugas.json(),
  ]);
  const dataPresensi = resultPresensi.data;
  const dataTugas = resultTugas.data;
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6 xl:col-span-8">
        <PresensiButtonCard data={dataPresensi} dataUser={dataUser} />
      </div>
      <div className="col-span-12 xl:col-span-4">
        <PresensiListCard data={dataPresensi} />
      </div>
       <div className="col-span-12 xl:col-span-8">
        <TaskSummaryCard data={dataTugas} />
      </div>
      <div className="col-span-12 xl:col-span-4">
        <EmployeeActivities data={dataTugas} />
      </div>
    </div>
  );
}
