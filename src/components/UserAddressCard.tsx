"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/form/InputField";
import Label from "@/components/form/Label";
import { FiEdit3, FiChevronDown } from "react-icons/fi";
import Select from "@/components/form/Select";
import DatePicker from "./form/date-picker";
import { useRouter } from "next/navigation";


interface DataProps {
  data: {
    id: string;
    posisi: string;
    role: string;
    lama_kontrak: string;
    tanggal_masuk: string;
    divisi_nama: string;
  };
}
export default function UserAddressCard({ data }: DataProps) {
  const router = useRouter();
  type OptionType = { value: string; label: string };
  const [divisiOptions, setDivisiOptions] = useState<OptionType[]>([]);
  const optionsKontrak = [
    { value: "Fulltime", label: "Fulltime" },
    { value: "Internship", label: "Internship" },
    { value: "1", label: "1 Tahun" },
    { value: "2", label: "2 Tahun" },
    { value: "3", label: "3 Tahun" },
    { value: "4", label: "4 Tahun" },
    { value: "5", label: "5 Tahun" },
  ];
  const optionsRole = [
    { value: "Staff", label: "Staff" },
    { value: "Admin", label: "Admin" },
    { value: "Manager", label: "Manager" },
    { value: "Direksi", label: "Direksi" },
  ];
  const fetchDivisi = useCallback(async () => {
    const res = await fetch('/api/divisi', { cache: "no-store" });
    const getData = await res.json();
    console.log(getData.data)
    const data = getData.data.map((item: any) => ({
      value: item.id,
      label: item.nama,
    }));
    setDivisiOptions(data);
  }, []);
  useEffect(() => {
    fetchDivisi();
  }, [fetchDivisi]);

  const { isOpen, openModal, closeModal } = useModal();
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
  const handleSelectChange = (name: string) => (value: string) => {
    if (name == 'divisi') {
      setItems(prev => ({
        ...prev,
        [`${name}_id`]: value,
        [`${name}_nama`]: divisiOptions.find(option => option.value === value)?.label || ''
      }));
    } else {
      setItems(prev => ({ ...prev, [name]: value }));
    }
  };
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
      router.refresh();
      if (!res.ok) throw new Error("Failed to submit form");
    } catch (err) {
      console.error("Submit error:", err);
    }
  };
  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Work Detail
            </h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-7 lg:gap-x-20 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Divisi
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {data.divisi_nama}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Posisi
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {data.posisi}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Jabatan
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {data.role}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Tanggal Masuk
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {data.tanggal_masuk}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Lama Kontrak
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {data.lama_kontrak === 'Fulltime' || data.lama_kontrak === 'Internship'
                    ? data.lama_kontrak
                    : <span>{data.lama_kontrak + " Tahun"}</span>}
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
        <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14 mb-7">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Work Detail
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="px-2 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Posisi</Label>
                  <Input type="text"
                    name="posisi"
                    value={items?.posisi || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>Divisi</Label>
                  <div className="relative">
                    <Select
                      options={divisiOptions}
                      placeholder="Select an option"
                      name="divisi"
                      onChange={handleSelectChange("divisi")}
                      className="dark:bg-dark-900"
                      required
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                      <FiChevronDown />
                    </span>
                  </div>
                </div>
                <div>
                  <Label>Role</Label>
                  <div className="relative">
                    <Select
                      options={optionsRole}
                      placeholder="Select an option"
                      name="role"
                      onChange={handleSelectChange("role")}
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
                    id="tanggal_masuk"
                    label="Tanggal Masuk"
                    placeholder="Pilih Tanggal"
                    name="tanggal_masuk"
                    required
                    defaultValue={items?.tanggal_masuk || ""}
                    onChange={(dates, currentDateString) => {
                      handleDate("tanggal_masuk", currentDateString);
                    }}
                  />
                </div>
                <div>
                  <Label>Lama Kontrak</Label>
                  <div className="relative">
                    <Select
                      options={optionsKontrak}
                      placeholder="Select an option"
                      name="lama_kontrak"
                      onChange={handleSelectChange("lama_kontrak")}
                      className="dark:bg-dark-900"
                      required
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                      <FiChevronDown />
                    </span>
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
        </div >
      </Modal >
    </>
  );
}
