"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FiTrash2, FiEdit, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { useModal } from "@/hooks/useModal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSave: () => void;
  apiEndpoint: string;
  status:string;
}

export default function PermissionEdit({ isOpen, onClose, apiEndpoint, status }: ModalProps) {
  const [isDataLoading, setIsDataLoading] = useState(false);
  return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        className="max-w-[500px] p-5 lg:p-10 text-center justify-items-center">
        {isDataLoading ? <ClipLoader color="white" /> : <>
          <FiTrash2 className="text-error-500 text-4xl justify-self-center mb-4" />
          <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
            Hapus Data
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">Apakah anda yakin akan menghapus data ini?</p>
          <div className="flex items-center justify-center w-full gap-3 mt-8">
            <Button size="sm" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button size="sm" className="bg-error-500 hover:bg-error-700">
              Ya, Hapus
            </Button>
          </div>
        </>
        }
      </Modal>
  );
}
