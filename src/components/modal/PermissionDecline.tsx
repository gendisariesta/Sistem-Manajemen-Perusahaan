"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { useModal } from "@/hooks/useModal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  id: string;
}

export default function PermissionDecline({ isOpen, onClose, onSave, id }: ModalProps) {
  const router = useRouter()
  const updateStatus = async () => {
    onClose();
    try {
      const res = await fetch('/api/izin/id/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Ditolak' }),
      });
      if (!res.ok) throw new Error('Gagal update status');
      const result = await res.json();
      onSave();
      console.log('Status berhasil diubah:', result);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };
  const [isDataLoading, setIsDataLoading] = useState(false);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[500px] p-5 lg:p-10 text-center justify-items-center">
      {isDataLoading ? <ClipLoader color="white" /> : <>
        <div className="bg-error-500 rounded-full justify-self-center p-3 mb-6">
          <FiX className="text-white text-4xl justify-self-center  " />
        </div>
        <h4 className="font-semibold text-gray-800 mb-3 text-title-sm dark:text-white/90">
          Tolak Data
        </h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">Apakah anda yakin akan menolak data ini?</p>
        <div className="flex items-center justify-center w-full gap-3 mt-8">
          <Button size="sm" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button size="sm" className="bg-error-500 hover:bg-error-800" onClick={updateStatus}>
            Ya, Tolak
          </Button>
        </div>
      </>
      }
    </Modal>
  );
}
