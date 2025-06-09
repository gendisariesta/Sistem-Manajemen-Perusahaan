"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FiChevronDown } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { useModal } from "@/hooks/useModal";
import Label from "../form/Label";
import Input from "../form/InputField";
import Select from "../form/Select";
import DatePicker from "../form/date-picker";
import FileInput from "../form/FileInput";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function PermissionAdd({ isOpen, onClose, onSave }: ModalProps) {
  const [post, setPost] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const options = [
    { value: "Cuti", label: "Cuti" },
    { value: "Izin", label: "Izin" },
    { value: "Izin Sakit", label: "Izin Sakit" },
  ];
  const handleSelectChange = (name: string) => (value: string) => {
    setPost(prev => ({ ...prev, [name]: value }));
    console.log(post)
  };
  const handleDate = (name: string, value: string) => {
    setPost(prev => ({ ...prev, [name]: value }));
    console.log(post)
  }
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(e.target.files[0]);
      setPost(prev => ({ ...prev, ['file_surat']: '/uploads/' + file.name }));
      console.log(post)
    }
  }
  useEffect(() => {
  if (isOpen) {
    const date = new Date();
    setPost({
      nama_user: 'Gendis Ariesta',
      nama_divisi: 'Marketing',
      tanggal_request: date.toLocaleDateString('en-GB').split('/').join('-'),
      status: 'Request',
    });
  }
}, [isOpen]);
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
      }
      const res = await fetch('/api/izin', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(post),
      });
      if (!res.ok) throw new Error("Failed to submit form");
      onSave();
      setPost({});
    } catch (err) {
      console.error("Submit error:", err);
    }
  };
  const [isDataLoading, setIsDataLoading] = useState(false);
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] p-5 lg:p-10">
      {isDataLoading ? <ClipLoader color="white" /> : <>
        <form onSubmit={handleCreate}>
          <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
            Tambah Data
          </h4>
          <div className="px-2 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>File Surat</Label>
                <div className="relative">
                  <FileInput onChange={handleFileChange} className="custom-class" required />
                </div>
              </div>
              <div>
                <Label>Jenis Izin</Label>
                <div className="relative">
                  <Select
                    options={options}
                    placeholder="Select an option"
                    name="jenis_izin"
                    onChange={handleSelectChange("jenis_izin")}
                    className="dark:bg-dark-900"
                    required
                  />
                  <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <FiChevronDown />
                  </span>
                </div>
              </div>
              <div>
                <DatePicker
                  id="tanggal_izin"
                  label="Tanggal Izin"
                  placeholder="Pilih Tanggal"
                  name="tanggal_izin"
                  required
                  onChange={(dates, currentDateString) => {
                    handleDate("tanggal_izin", currentDateString);
                  }}
                />
              </div>
              <div>
                <DatePicker
                  id="tanggal_masuk"
                  label="Tanggal masuk"
                  placeholder="Pilih Tanggal"
                  name="tanggal_masuk"
                  required
                  onChange={(dates, currentDateString) => {
                    handleDate("tanggal_masuk", currentDateString);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end w-full gap-3 mt-8">
            <Button size="sm" variant="outline" onClick={onClose}>Batal</Button>
            <Button size="sm" type="submit">Simpan</Button>
          </div>
        </form>
      </>
      }
    </Modal>
  );
}
