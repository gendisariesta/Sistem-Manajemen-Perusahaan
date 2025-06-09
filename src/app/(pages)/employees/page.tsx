"use client"
import PageBreadcrumb from "@/components/PageBreadCrumb";
import { useModal } from "@/hooks/useModal";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import BasicTableOne from "@/components/table/BasicTableOne";
import { FiTrash2, FiArrowRight, FiPlus } from "react-icons/fi";
import DeleteModal from "@/components/modal/DeleteModal";
import Link from "next/link";

export default function EmployeePage() {
  const columns = ['Nama', 'Divisi', 'Aksi'];
  const [items, setItems] = useState<any[]>([]);
  const [id, setId] = useState("");
  const { isOpen: isDeleteOpen, openModal: openDeleteModal, closeModal: closeDeleteModal } = useModal();
  const handleSave = () => { closeDeleteModal(); fetchData(); };

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/users', { cache: "no-store" });
      const getData = await res.json();
      setItems(getData?.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const data = useMemo(() => {
    return items.map((item: any, index: number) => ({
      Nama: item.nama || 'N/A',
      Divisi: item.divisi_nama || 'N/A',
      Aksi: (
        <div className="flex gap-2" key={item.id || index}>
          <button
            className="bg-error-600 px-2 py-2 rounded-full"
            onClick={() => {
              openDeleteModal();
              setId(item.id);
            }}
          >
            <FiTrash2 className="text-white text-base" />
          </button>
          <Link href={'/employees/'+item.id}>
          <button
            className="bg-brand-500 px-2 py-2 rounded-full"
          >
            <FiArrowRight className="text-white text-base" />
          </button>
          </Link>
        </div>
      ),
    }));
  }, [items, openDeleteModal]);

  return (
    <div>
      <PageBreadcrumb pageTitle="Tabel List Karyawan" />
      <div className="max-w-[--breakpoint-2xl] min-h-screen rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] xl:p-7">
        <div className="space-y-6">
          <Link href='/employees/add'>
          <button className="bg-brand-600 px-3 py-2 rounded-lg flex text-white items-center mb-5 justify-self-end">
            Tambah Data
            <FiPlus className="text-white text-lg ms-2" />
          </button>
          </Link>
          <BasicTableOne columns={columns} data={data} />
          <DeleteModal
            isOpen={isDeleteOpen}
            onClose={closeDeleteModal}
            onSave={handleSave}
            apiEndpoint={`/api/users/id/${id}`} />
        </div>
      </div>
    </div>
  );
}