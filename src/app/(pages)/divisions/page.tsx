"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import PageBreadcrumb from "@/components/PageBreadCrumb";
import { FiTrash2, FiEdit, FiPlus } from "react-icons/fi";
import { useModal } from "@/hooks/useModal";
import AddModal from "@/components/modal/AddModal";
import DeleteModal from "@/components/modal/DeleteModal";
import UpdateModal from "@/components/modal/UpdateModal";
import BasicTableOne from "@/components/table/BasicTableOne";
import Button from "@/components/ui/Button";

export default function DivisionsPage() {
  const columns = ["Divisi", "Jumlah_Anggota", "Aksi"];
  const fields = [{ name: "nama", label: "Nama Divisi", type: "text" },];
  const [items, setItems] = useState<any[]>([]);
  const [id, setId] = useState("");
  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();
  const {
    isOpen: isDeleteOpen,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();
  const {
    isOpen: isAddOpen,
    openModal: openAddModal,
    closeModal: closeAddModal,
  } = useModal();
  const fetchData = useCallback(async () => {

    try {
      const res = await fetch('/api/divisi', { cache: "no-store" });
      const getData = await res.json();
      setItems(getData?.data || []);
      const user = await fetch('/api/users', { cache: "no-store" });
      const getUser = await user.json();
      const combined = (getData?.data || []).map((item: any) => {
        const jumlah = getUser?.data?.filter((u: any) => u.divisi_nama === item.nama).length || 0;
        return {
          ...item,
          jumlah,
        };
      });
      setItems(combined);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const data = useMemo(() => {
    return items.map((item: any, index: number) => ({
      Divisi: item.nama || 'N/A',
      Jumlah_Anggota: item.jumlah || 0,
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
          <button
            className="bg-warning-500 px-2 py-2 rounded-full"
            onClick={() => {
              openEditModal();
              setId(item.id);
            }}
          >
            <FiEdit className="text-white text-base" />
          </button>
        </div>
      ),
    }));
  }, [items, openDeleteModal, openEditModal]);
  const handleSave = () => {
    closeAddModal();
    closeEditModal();
    closeDeleteModal();
    fetchData();
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Tabel List Divisi" />
      <div className="max-w-[--breakpoint-2xl] min-h-screen rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] xl:p-7">
        <div className="space-y-6">
          <div className="justify-self-end">
            <Button size="sm" variant="primary" onClick={openAddModal}>
              Tambah Data
              <FiPlus className="text-white text-lg ms-2" />
            </Button>
          </div>
          <BasicTableOne columns={columns} data={data} />
          <AddModal
            isOpen={isAddOpen}
            onClose={closeAddModal}
            onSave={handleSave}
            fields={fields}
            apiEndpoint="/api/divisi"
            title="Form Input Divisi" />
          <DeleteModal
            isOpen={isDeleteOpen}
            onClose={closeDeleteModal}
            onSave={handleSave}
            apiEndpoint={`/api/divisi/id/${id}`} />
          <UpdateModal
            isOpen={isEditOpen}
            onClose={closeEditModal}
            onSave={handleSave}
            id={id} />
        </div>
      </div>
    </div>
  );
}
