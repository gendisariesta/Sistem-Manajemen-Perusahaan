"use client";
import React, { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import { doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import app from "@/lib/firebase/init";
import ComponentCard from "../ComponentCard";
import Label from "../form/Label";
import Input from "../form/InputField";
const firestore = getFirestore(app);

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  id: string;
}

export default function UpdateModal({ isOpen, onClose, onSave, id }: UpdateModalProps) {
  const router = useRouter();
  const [items, setItems] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/divisi/id/${id}`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const getData = await res.json();
      setItems(getData || {});
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [fetchData, isOpen]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItems((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/divisi/id/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(items),
      });

      if (!res.ok) throw new Error("Failed to submit form");

      if (onSave) onSave();
      router.refresh();
      onClose();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] p-5 lg:p-10">
      <h4 className="font-semibold text-gray-800 mb-7 text-title-sm dark:text-white/90">
        Update Divisi
      </h4>
      <ComponentCard title="Form Update Divisi">
        <div className="space-y-6">
          <div>
            <Label>Nama Divisi</Label>
            <Input
              type="text"
              name="nama"
              value={items?.nama || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </ComponentCard>
      <div className="flex items-center justify-end w-full gap-3 mt-8">
        <Button size="sm" variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button size="sm" onClick={handleUpdate}>
          Save Changes
        </Button>
      </div>
    </Modal>
  );
}
