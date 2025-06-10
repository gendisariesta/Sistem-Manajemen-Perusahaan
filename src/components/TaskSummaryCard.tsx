"use client";
import React from "react";
import Badge from "./ui/Badge";
import { FiClipboard, FiLoader, FiCheckCircle } from "react-icons/fi"
type Props = {
  data: { [key: string]: any }[]
}
export default function TaskSummaryCard({ data }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <p className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-5">
        Task Summary
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {/* To Do */}
        <div className="p-4 border rounded-xl bg-white  dark:bg-gray-900 dark:border-gray-700 flex items-center gap-4">
          <FiClipboard className="text-blue-500 text-3xl" />
          <div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">To Do</h3>
            <p className="text-3xl font-bold text-blue-500">5</p>
          </div>
        </div>

        {/* On Progress */}
        <div className="p-4 border rounded-xl bg-white  dark:bg-gray-900 dark:border-gray-700 flex items-center gap-4">
          <FiLoader className="text-yellow-500 text-3xl" />
          <div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">On Progress</h3>
            <p className="text-3xl font-bold text-yellow-500">3</p>
          </div>
        </div>

        {/* Completed */}
        <div className="p-4 border rounded-xl bg-white  dark:bg-gray-900 dark:border-gray-700 flex items-center gap-4">
          <FiCheckCircle className="text-green-500 text-3xl" />
          <div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">Completed</h3>
            <p className="text-3xl font-bold text-green-500">7</p>
          </div>
        </div>
      </div>
    </div>
  );
};
