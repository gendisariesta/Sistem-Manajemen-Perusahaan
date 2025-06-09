"use client";
import React from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/form/InputField";
import Label from "@/components/form/Label";
interface DataProps{
  data:{
    nama:string;
    email:string;
    no_hp:string;
    tanggal_lahir:string;
    alamat:string;
  };
}
export default function UserInfoCard({data}:DataProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nama Lengkap
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.nama}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                No HP
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.no_hp}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Tanggal Lahir
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.tanggal_lahir}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Alamat
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {data.alamat}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
