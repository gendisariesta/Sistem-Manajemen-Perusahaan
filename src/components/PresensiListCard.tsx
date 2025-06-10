"use client";
import React from "react";
import Badge from "./ui/Badge";
import { FiCheckCircle, FiFrown, FiCoffee  } from "react-icons/fi";
type Props = {
  data: { [key: string]: any }[]
}
export default function PresensiListCard({ data }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <div className="flex items-end justify-between mt-2 mb-2">
        <div>
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <FiCheckCircle className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Kehadiran
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            12 hari
          </h4>
        </div>
        <div>
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <FiFrown className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Izin Sakit
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            0 hari
          </h4>
        </div>
        <div>
           <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <FiCoffee className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Izin Cuti
          </span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            2 hari
          </h4>
        </div>
      </div>
    </div>
  );
};
