"use client";
import React, { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { useModal } from "@/hooks/useModal";
import Label from "../form/Label";
import Input from "../form/InputField";

type ModalProps = {
  kpi: string[];
  data: { [key: string]: string };
  isOpen: boolean;
  closeModal: () => void;
}
export default function KpiUserAdd({ kpi, isOpen, closeModal, data }: ModalProps) {
  const [post, setPost] = useState<Record<string, string>>({});
  const [update, setUpdate] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (isOpen) {
      setPost(data);
      setUpdate(false);
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/kpi_user/id/${data.id}`);
          const result = await response.json();
          if (result && result.id && result.id !== '') {
            setPost(result);
            setUpdate(true);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [isOpen]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    closeModal();
    try {
      const endpoint = update
        ? `/api/kpi_user/id/${data.id}`
        : '/api/kpi_user';
      const method = update ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });

      if (!res.ok) throw new Error("Failed to submit form");
      router.refresh();
      setPost({});
    } catch (err) {
      console.error("Submit error:", err);
    }
  };
  const [isDataLoading, setIsDataLoading] = useState(false);
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="max-w-[600px] p-5 lg:p-10">
      {isDataLoading ? <ClipLoader color="white" /> : <>
        <form onSubmit={handleCreate}>
          <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
            Tambah Data
          </h4>
          <div className="px-2 overflow-y-auto custom-scrollbar">
            {kpi.map((e: any, i) => (
              <div className="mb-3" key={i}>
                <Label>{e}</Label>
                <Input
                  type='number'
                  name={e}
                  value={post[e] || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-end w-full gap-3 mt-8">
            <Button size="sm" variant="outline" onClick={closeModal}>Batal</Button>
            <Button size="sm" type="submit">Simpan</Button>
          </div>
        </form>
      </>
      }
    </Modal>
  );
}
