
"use client";
import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import Button from "../ui/Button";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import DeleteModal from "../modal/DeleteModal";
import UpdateModal from "../modal/UpdateModal";
import AddModal from "../modal/AddModal";
type KpiDataProps = {
    dataKpi: { [key: string]: any }[];
    dataUser: { [key: string]: any }[];
}
export default function KpiData(props: KpiDataProps) {
    const {
        isOpen: isEditOpen,
        openModal: openEditModal,
        closeModal: closeEditModal,
    } = useModal();
    const {
        isOpen: isDeleteOpen,
        openModal: openDeleteModal,
        closeModal: closeDeleteModal,
    } = useModal();
    const {
        isOpen: isAddOpen,
        openModal: openAddModal,
        closeModal: closeAddModal,
    } = useModal();
    const [data, setData] = useState<any>({});
    const [items, setItems] = useState<any[]>([]);
    const [id, setId] = useState('')
    const [divisi, setDivisi] = useState<any[]>([]);
    const columns = ['KPI', 'Bobot', 'Aksi']
    const searchParams = useSearchParams();
    const currentDiv = searchParams.get('divisi')
    
    useEffect(() => {
        const anggota = props.dataUser.filter((e: any) => e.divisi_nama == currentDiv);
        const direksi = anggota.filter((e: any) => e.role == 'Direksi');
        const manager = anggota.filter((e: any) => e.role == 'Manager');
        setData({ direksi: direksi[0], manager: manager, jumlah: anggota.length })
        setDivisi([anggota[0]?.divisi_id, anggota[0]?.divisi_nama])
        setItems(props.dataKpi
            .filter((f) => f.divisi_nama == currentDiv)
            .map((e, i) => ({
                KPI: e.kpi,
                Bobot: e.bobot + "%",
                Aksi: (
                    <div className="flex gap-2" key={i}>
                        <button
                            className="bg-error-600 px-2 py-2 rounded-full"
                            onClick={() => {
                                openDeleteModal();
                                setId(e.id);
                            }}
                        >
                            <FiTrash2 className="text-white text-base" />
                        </button>
                        <button
                            className="bg-warning-500 px-2 py-2 rounded-full"
                            onClick={() => {
                                openEditModal();
                                setId(e.id);
                            }}
                        >
                            <FiEdit className="text-white text-base" />
                        </button>
                    </div>
                )
            })));
    }, [props.dataKpi]);
    console.log(items);
      const fields = [
        { name: "kpi", label: "Nama Kpi", type: "text" },
        { name: "bobot", label: "Bobot", type: "number" },];
    console.log(data)
    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:w-5/7">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-medium text-gray-800 text-theme-xl dark:text-white/90">Form KPI Divisi</h3>
                <h4 className="text-base font-medium text-gray-700 dark:text-gray-400">{currentDiv}</h4>
            </div>
            <div className="p-5 xl:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">
                            Direksi</span>
                        <h5 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">{data?.direksi?.nama}</h5>
                        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{data?.direksi?.email}</p>
                    </div>
                    <div className="h-px w-full bg-gray-200 dark:bg-gray-800 sm:h-[158px] sm:w-px"></div>
                    {data?.manager?.map((e: any) => (
                        <div key={e.id} className="sm:text-right">
                            <span
                                className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">Manager</span>
                            <h5 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">{e.nama}</h5>
                            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">{e.email}</p>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-end gap-3 mb-5">
                    <Button size="sm" variant="primary" onClick={openAddModal} >
                        Tambah Data
                        <FiPlus className="text-white text-lg ms-2" />
                    </Button>
                </div>
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="max-w-full overflow-x-auto">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-3 font-large text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                        No
                                    </TableCell>
                                    {columns.map((col, i) => (
                                        <TableCell
                                            key={i}
                                            isHeader
                                            className="px-5 py-3 font-large text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {col}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {items.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                            {rowIndex + 1}
                                        </TableCell>
                                        {columns.map((col, i) => (
                                            <TableCell
                                                key={i}
                                                className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                                {row[col]}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                <div className="flex items-center justify-start gap-3 mt-5">
                    <div>
                        <span className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-400">
                            Jumlah</span>
                        <h5 className="mb-2 text-base font-semibold text-gray-800 dark:text-white/90">{data.jumlah} Anggota</h5>
                    </div>
                </div>
            </div>
            <AddModal
                isOpen={isAddOpen}
                onClose={closeAddModal}
                fields={fields}
                apiEndpoint="/api/kpi"
                title="Form Input Kpi"
                addpost={divisi} />
            <DeleteModal
                isOpen={isDeleteOpen}
                onClose={closeDeleteModal}
                apiEndpoint={`/api/kpi/id/${id}`} />
            <UpdateModal
                isOpen={isEditOpen}
                onClose={closeEditModal}
                id={id} />
        </div>

    );
}