"use client"
import ComponentCard from "@/components/ComponentCard";
import DatePicker from "@/components/form/date-picker";
import Input from "@/components/form/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/Button";
import FileInput from "@/components/form/FileInput";
import PageBreadcrumb from "@/components/PageBreadCrumb";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { FiMail, FiUser, FiPhone, FiLock, FiEye, FiEyeOff, FiChevronDown, FiHome } from "react-icons/fi";
import Select from "@/components/form/Select";
import { useRouter } from "next/navigation";
import bcrypt from 'bcryptjs';


export default function AddEmployee() {
    type OptionType = { value: string; label: string };
    const [showPassword, setShowPassword] = useState(false);
    const [divisiOptions, setDivisiOptions] = useState<OptionType[]>([]);
    const [post, setPost] = useState<Record<string, string>>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const router = useRouter();
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPost((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        console.log(post)
    };
    const handleSelectChange = (name: string) => (value: string) => {
        if (name == 'divisi') {
            setPost(prev => ({
                ...prev,
                [`${name}_id`]: value,
                [`${name}_nama`]: divisiOptions.find(option => option.value === value)?.label || ''
            }));
        } else {
            setPost(prev => ({ ...prev, [name]: value }));
            console.log(post)
        }
    };
    const handleDate = (name: string, value: string) => {
        setPost(prev => ({ ...prev, [name]: value }));
        console.log(post)
    }
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setSelectedFile(e.target.files[0]);
            setPost(prev => ({ ...prev, ['foto_profil']: file.name }));
            console.log(post)
        }
    }
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);
                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });
            }
            const hashedPassword = await bcrypt.hash(post.password, 10);
            const newPost = {
                ...post,
                password: hashedPassword,
            };
            console.log(newPost)
            const res = await fetch('/api/users', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newPost),
            });
            if (!res.ok) throw new Error("Failed to submit form");
            router.push('/employees');
            setPost({});
        } catch (err) {
            console.error("Submit error:", err);
        }
    };



    return (
        <div>
            <PageBreadcrumb pageTitle="Tambah Data Karyawan" />
            <div className="max-w-[--breakpoint-2xl] min-h-screen rounded-2xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-white/[0.03] xl:p-7">
                <form onSubmit={handleCreate}>
                    <div className="space-y-6">
                        <ComponentCard title="Data Diri Karyawan">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <Label>Foto Profil</Label>
                                    <div className="relative">
                                        <FileInput onChange={handleFileChange} className="custom-class" required />
                                    </div>
                                </div>
                                <div>
                                    <Label>Nama Lengkap</Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Nama Lengkap"
                                            type="text"
                                            className="pl-[62px]"
                                            name="nama"
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                            <FiUser />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="info@gmail.com"
                                            type="email"
                                            className="pl-[62px]"
                                            name="email"
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                            <FiMail />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label>Password</Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Password"
                                            type={showPassword ? "text" : "password"}
                                            className="pl-[62px]"
                                            name="password"
                                            onChange={handleChange}
                                            required
                                        />
                                        <button
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <FiEye className="fill-gray-100 dark:fill-gray-400" />
                                            ) : (
                                                <FiEyeOff className="fill-gray-100 dark:fill-gray-400" />
                                            )}
                                        </button>
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                            <FiLock />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <DatePicker
                                        id="tanggal_lahir"
                                        label="Tanggal Lahir"
                                        placeholder="Pilih Tanggal"
                                        name="tanggal_lahir"
                                        required
                                        onChange={(dates, currentDateString) => {
                                            handleDate("tanggal_lahir", currentDateString);
                                        }}
                                    />
                                </div>
                                <div>
                                    <Label>No Hp (WA)</Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="+62"
                                            type="text"
                                            className="pl-[62px]"
                                            name="no_hp"
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                            <FiPhone />
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label>Alamat Lengkap</Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Alamat Lengkap"
                                            type="text"
                                            className="pl-[62px]"
                                            name="alamat"
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
                                            <FiHome />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </ComponentCard>
                        <ComponentCard title="Kontrak Karyawan">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <DatePicker
                                        id="tanggal_masuk"
                                        label="Tanggal Masuk"
                                        placeholder="Pilih Tanggal"
                                        name="tanggal_masuk"
                                        onChange={(dates, currentDateString) => {
                                            handleDate("tanggal_masuk", currentDateString);
                                        }}
                                        required
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
                                    <Label>Posisi</Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Posisi"
                                            type="text"
                                            name="posisi"
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
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
                            </div>
                        </ComponentCard>
                        <Button size="sm" variant="primary" className="w-full mt-5" type="submit">
                            Simpan
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}