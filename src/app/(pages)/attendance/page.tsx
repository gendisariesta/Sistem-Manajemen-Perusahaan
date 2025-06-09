"use client"
import PageBreadcrumb from "@/components/PageBreadCrumb";
import ComponentCard from "@/components/ComponentCard";
import BasicTableOne from "@/components/table/BasicTableOne";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";
import { FiTrash2, FiArrowRight, FiPlus } from "react-icons/fi";

export default function AttendancePage() {
  const columns = ['Nama Karyawan', 'Divisi', 'Tanggal', 'Jam Masuk', 'Jam Keluar'];
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/kehadiran', { cache: "no-store" });
      const result = await res.json()
      const dataKehadiran = result.data.map((e:any) => ({
        'Nama Karyawan': e.nama_user || '-',
        'Divisi': e.nama_divisi || '-',
        'Tanggal': e.tanggal || '-',
        'Jam Masuk': e.jam_masuk || '-',
        'Jam Keluar': e.jam_keluar || '-',
      }
      ))
      setItems(dataKehadiran)
    })();
  }, []);
  
  return (
    <div>
      <PageBreadcrumb pageTitle="Tabel Kehadiran Karyawan" />
      <div className="max-w-(--breakpoint-2xl) min-h-screen rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] xl:p-7">
        <div className="space-y-6">
          <BasicTableOne columns={columns} data={items} />
        </div>
      </div>
    </div>
  );
}