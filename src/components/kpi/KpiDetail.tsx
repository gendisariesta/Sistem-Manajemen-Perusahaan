
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
import { FiPlus, FiArrowRight, FiEdit } from "react-icons/fi";
import { useSearchParams } from "next/navigation";
import BasicTableOne from "../table/BasicTableOne";
import KpiUserAdd from "@/components/modal/KpiUserAdd"
import { useModal } from "@/hooks/useModal";
type KpiDataProps = {
    dataKpi: { [key: string]: any }[];
    dataKpiUser: { [key: string]: any }[];
    dataUser: { [key: string]: any }[];
}
export default function KpiDetail(props: KpiDataProps) {
    const [data, setData] = useState<any[]>([]);
    const [post, setPost] = useState<Record<string, string>>({});
    const [columns, setColumns] = useState<any[]>([]);
    const [kpi, setKpi] = useState<any[]>([]);
    const searchParams = useSearchParams();
    const currentDiv = searchParams.get('divisi')
    const { isOpen, openModal, closeModal } = useModal();
    useEffect(() => {
        const user = props.dataUser.filter((e) => e.divisi_nama == currentDiv)
        const Kpi = props.dataKpi.filter((e) => e.divisi_nama == currentDiv);
        setColumns(['Nama Karyawan']);
        Kpi.map((e: any) => setColumns(prev => ([...prev, e.kpi])));
        setKpi(Kpi.map((e: any)=>e.kpi));
        setColumns(prev => ([...prev, 'Total Skor', 'Aksi']));
        const newData: any[] = [];
        user.forEach((e: any) => {
            const KpiUser = props.dataKpiUser.find((u) => u.nama_user === e.nama);
            if (!KpiUser) {
                const row: any = {
                    'Nama Karyawan': e.nama,
                    'Aksi': (
                        <button
                            className="bg-brand-500 px-2 py-2 rounded-full"
                            onClick={() => {
                                openModal();
                                setPost({
                                    id_user: e.id,
                                    nama_user: e.nama,
                                    id_divisi: e.divisi_id,
                                    nama_divisi: e.divisi_nama
                                });
                            }}>
                            <FiEdit className="text-white text-base" />
                        </button>
                    )
                };
                newData.push(row);
            } else {
                const row: any = {
                    'Nama Karyawan': e.nama,
                    'Aksi': (
                        <button
                            className="bg-brand-500 px-2 py-2 rounded-full"
                            onClick={() => {
                                openModal();
                                setPost({
                                    id:KpiUser.id,
                                    id_user: e.id,
                                    nama_user: e.nama,
                                    id_divisi: e.divisi_id,
                                    nama_divisi: e.divisi_nama
                                });
                            }}>
                            <FiEdit className="text-white text-base" />
                        </button>
                    )
                    
                };
                let total = 0;
                Kpi.forEach((p) => {
                    row[p.kpi] = (Number(KpiUser[p.kpi])*p.bobot/100);
                    total += Number(KpiUser?.[p.kpi])
                    row['Total Skor'] = total
                });
                newData.push(row);
            }
        });
        setData(newData);

    }, [props.dataKpi]);
    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] xl:w-full">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-medium text-gray-800 text-theme-xl dark:text-white/90">Form KPI Karyawan</h3>
                <h4 className="text-base font-medium text-gray-700 dark:text-gray-400">{currentDiv}</h4>
            </div>
            <div className="p-5 xl:p-8 overflow-x">
                <BasicTableOne data={data} columns={columns} />
            </div>
            <KpiUserAdd data={post} isOpen={isOpen} closeModal={closeModal} kpi={kpi} />
        </div>
    );
}