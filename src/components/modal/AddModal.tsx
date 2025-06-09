"use client";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import ComponentCard from "../ComponentCard";
import Label from "../form/Label";
import Input from "../form/InputField";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  fields: { name: string; label: string; type: string, hidden?: boolean; value?: string; }[];
  apiEndpoint: string;
  title: string;
  addpost?: string[];
}
export default function AddModal({ isOpen, onClose, onSave, fields, apiEndpoint, title, addpost }: AddModalProps) {
  const router = useRouter()
  const [post, setPost] = useState<Record<string, string>>({});
  const [isDataLoading, setIsDataLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (addpost !== undefined) {
      setPost((prev) => ({ ...prev, ['divisi_id']: addpost[0], ['divisi_nama']: addpost[1] }));
    }
    console.log(post);
  };
  const handleCreate = async () => {
    setIsDataLoading(true);
    const check = await fetch('http://localhost:3000' + apiEndpoint);
    const result = await check.json();
    // const checkData = result.data.some((item: { nama: string }) => item.nama.toLowerCase().replace(/\s+/g, '') === post.nama.toLowerCase().replace(/\s+/g, ''));
    // if (checkData) {
    //   alert("Divisi sudah ada!");
    //   setIsDataLoading(false);
    // } else {
      console.log(post);
      try {
        const res = await fetch(apiEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(post),
        });
        if (onSave) onSave();
        onClose();
        setPost({});
        router.refresh();
        if (!res.ok) throw new Error("Failed to submit form");
        setIsDataLoading(false);
      } catch (err) {
        console.error("Submit error:", err);
      }
    // }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-5 lg:p-10">
      {isDataLoading ? <ClipLoader color="white" /> :
        <form action={handleCreate}>
          <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
            Tambah Data
          </h4>
          <ComponentCard title={title}>
            <div className="space-y-6">
              {fields.map((field) => (
                <div key={field.name}>
                  <Label>{field.label}</Label>
                  <Input
                    type={field.type}
                    name={field.name}
                    value={post[field.name] || ""}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}
            </div>
          </ComponentCard>
          <div className="flex items-center justify-end w-full gap-3 mt-8">
            <Button size="sm" variant="outline" onClick={onClose}>Batal</Button>
            <Button size="sm" type="submit">Simpan</Button>
          </div>
        </form>
      }
    </Modal>
  );
}
