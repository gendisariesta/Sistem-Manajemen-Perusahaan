"use client";
import React, { useEffect, useState } from "react";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import { FiClock } from "react-icons/fi";
import { useRouter } from "next/navigation";

type Props = {
  data: { [key: string]: any }[];
  dataUser: { [key: string]: any };
}
export default function PresensiButtonCard(props: Props) {
  const router = useRouter();
  const date = new Date();
  const today = date.toLocaleDateString('en-GB').split('/').join('-')
  const data = props.data.find((e) => e.tanggal == today)
  const update = data?.jam_masuk!==undefined
  const [selisih, setSelisih] = useState('');
  const [selisihKeluar, setSelisihKeluar] = useState('');
  const parseTime = (str: string) => {
    const [jam, menit, detik] = str.split('.').map(Number);
    return new Date(0, 0, 0, jam, menit || 0);
  };
  const formatSelisih = (ms: number) => {
    const menit = ms / 60000;
    const tanda = menit >= 0 ? '' : '-';
    const jam = Math.floor(Math.abs(menit) / 60);
    const sisaMenit = Math.abs(menit) % 60;
    return `${tanda}${jam} jam ${sisaMenit} menit`;
  };
  const hitungSelisih = () => {
    const jamMasuk = '08.00.00';
    const jamKeluar = '17.00.00';
    const jamBerangkat = data?.jam_masuk || '07.00.00';
    const jamPulang = data?.jam_keluar || '17.00.00';
    const waktuBerangkat = parseTime(jamBerangkat);
    const waktuMasuk = parseTime(jamMasuk);
    const waktuKeluar = parseTime(jamKeluar);
    const waktuPulang = parseTime(jamPulang);
    const msMasuk = Number(waktuMasuk) - Number(waktuBerangkat);
    const msKeluar =  Number(waktuPulang)- Number(waktuKeluar);
    setSelisih(formatSelisih(msMasuk));
    setSelisihKeluar(formatSelisih(msKeluar));
  };
  useEffect(() => {
    hitungSelisih();
  }, [data]);
  const presensi = async () => {
     try {
      const endpoint = update
        ? `/api/kehadiran/id/${data?.id}`
        : '/api/kehadiran';
      const method = update ? "PUT" : "POST";
      const post = update ?
        {
          jam_keluar: date.toLocaleTimeString()
        } :
        {
          nama_user: props.dataUser.nama,
          id_divisi: props.dataUser.divisi_id,
          tanggal: today,
          nama_divisi: props.dataUser.divisi_nama,
          id_user: props.dataUser.uid,
          jam_masuk: date.toLocaleTimeString()
        }
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
      });
      if (!res.ok) throw new Error("Failed to submit form");
      router.refresh();
    } catch (err) {
      console.error("Submit error:", err);
    }
  }  
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <Button size="sm" variant="primary" onClick={presensi} disabled={data?.jam_masuk !== undefined}>
          Mulai Presensi
          <FiClock />
        </Button>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-md text-gray-500 dark:text-gray-400">
              Waktu Presensi Masuk
            </span>
            <h5 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.jam_masuk || '00.00.00'}
            </h5>
          </div>
          <Badge color={selisih.includes('-') ? 'error' : 'success'}>
            {selisih || '0 menit'}
          </Badge>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <Button size="sm" variant="primary" onClick={presensi} disabled={data?.jam_masuk == undefined || data?.jam_keluar !== undefined}>
          Akhiri Presensi
          <FiClock />
        </Button>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-md text-gray-500 dark:text-gray-400">
              Waktu Presensi Keluar
            </span>
            <h5 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {data?.jam_keluar || '00.00.00'}
            </h5>
          </div>
          <Badge color={selisihKeluar.includes('-') ? 'error' : 'success'}>
            {selisihKeluar || '0 menit'}
          </Badge>
        </div>
      </div>
    </div>
  );
}
