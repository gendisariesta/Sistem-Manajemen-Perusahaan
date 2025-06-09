"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/form/InputField";
import Label from "@/components/form/Label";
import Image from "next/image";
import { FiEdit3 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import DatePicker from "./form/date-picker";

interface DataProps {
  data: {
    id: string;
    nama: string;
    posisi: string;
    email: string;
    foto_profil: string;
    no_hp: string;
    tanggal_lahir: string;
    alamat: string;
  };
}
export default function UserMetaCard({ data }: DataProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const [items, setItems] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (data) {
      setItems(data);
    }
  }, [data]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItems((prev) => ({ ...prev, [name]: value }));
  };
  const handleDate = (name: string, value: string) => {
        setItems(prev => ({ ...prev, [name]: value }));
    }
  const handleSave = async () => {
    closeModal();
    try {
      const res = await fetch(`/api/users/id/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(items),
      });
      if (!res.ok) throw new Error("Failed to submit form");
      router.refresh();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <Image
                width={80}
                height={80}
                src={'/uploads/'+data?.foto_profil}
                alt="user"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {data?.nama}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {data?.posisi}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {data?.email}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto">
            <FiEdit3 />
            Edit
          </button>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nama Lengkap</Label>
                    <Input type="text"
                      name="nama"
                      value={items?.nama || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email</Label>
                    <Input type="text"
                      name="email"
                      value={items?.email || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>No Hp</Label>
                    <Input type="text"
                      name="no_hp"
                      value={items?.no_hp || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <DatePicker
                      id="tanggal_lahir"
                      label="Tanggal Lahir"
                      placeholder="Pilih Tanggal"
                      name="tanggal_lahir"
                      required
                      defaultValue={items?.tanggal_lahir || ""}
                      onChange={(dates, currentDateString) => {
                        handleDate("tanggal_lahir", currentDateString);
                      }}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Alamat</Label>
                    <Input type="text"
                      name="alamat"
                      value={items?.alamat || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
