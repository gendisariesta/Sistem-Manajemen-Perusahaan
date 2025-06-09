"use client"
import PermissionAdd from "@/components/modal/PermissionAdd";
import PermissionDecline from "@/components/modal/PermissionDecline";
import PermissionVerif from "@/components/modal/PermissionVerif";
import PageBreadcrumb from "@/components/PageBreadCrumb";
import BasicTableOne from "@/components/table/BasicTableOne";
import { useModal } from "@/hooks/useModal";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import { FiDownload, FiPlus, FiCheck, FiX } from "react-icons/fi";

export default function PermissionPage() {
  const columns = ['Nama Karyawan', 'Tanggal Request', 'Tanggal Izin', 'Tanggal Masuk', 'Status', 'Aksi'];
  const { isOpen: isAdd, openModal: openAdd, closeModal: closeAdd } = useModal();
  const { isOpen: isVerif, openModal: openVerif, closeModal: closeVerif } = useModal();
  const { isOpen: isDecline, openModal: openDecline, closeModal: closeDecline } = useModal();
  const [id, setId] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const fetchData = useCallback
    (async () => {
      const res = await fetch('/api/izin', { cache: 'no-store' });
      const result = await res.json();
      const dataIzin = result.data.map((e: any) => ({
        'Nama Karyawan': e.nama_user || '-',
        'Tanggal Request': e.tanggal_request || '-',
        'Tanggal Izin': e.tanggal_izin || '-',
        'Tanggal Masuk': e.tanggal_masuk || '-',
        'Status': e.status || '-',
        'Aksi':
          (
            <div className="flex gap-2">
              <Link href={'/uploads/'+e.file_surat} target="blank">
              <button className="bg-brand-600 px-2 py-2 rounded-full">
                <FiDownload className="text-white text-base" />
              </button>
              </Link>
              {(e.status == 'Request') ? (<>
                <button
                  className="bg-success-500 px-2 py-2 rounded-full"
                  onClick={() => {
                    openVerif();
                    setId(e.id);
                  }} >
                  <FiCheck className="text-white text-base" />
                </button>
                <button
                  className="bg-error-500 px-2 py-2 rounded-full"
                  onClick={() => {
                    openDecline();
                    setId(e.id);
                  }}>
                  <FiX className="text-white text-base" />
                </button></>) : null}
            </div>
          ),
      }))
      setItems(dataIzin);
    }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleSave = () => {fetchData();}
  return (
    <div>
      <PageBreadcrumb pageTitle="Tabel Request Izin" />
      <div className="max-w-(--breakpoint-2xl) min-h-screen rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] xl:p-7">
        <div className="space-y-6">
          <button className="bg-brand-600 px-3 py-2 rounded-lg flex text-white items-center mb-5 justify-self-end" onClick={openAdd}>Tambah Data<FiPlus className="text-white text-lg ms-2" /></button>
          <BasicTableOne columns={columns} data={items} />
          <PermissionAdd isOpen={isAdd} onClose={closeAdd} onSave={handleSave} />
          <PermissionVerif isOpen={isVerif} onClose={closeVerif} onSave={handleSave} id={id} />
          <PermissionDecline isOpen={isDecline} onClose={closeDecline} onSave={handleSave} id={id} />
        </div>
      </div>
    </div>
  );
}