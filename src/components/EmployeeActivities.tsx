"use client";
import React from "react";
import Badge from "./ui/Badge";
import { FiCheckCircle, FiFrown, FiCoffee } from "react-icons/fi";
type Props = {
  data: { [key: string]: any }[]
}
export default function EmployeeActivities({ data }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <p className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-5">
        Employee Activies
      </p>
      <div className="relative pl-6 border-l-2 border-gray-300 dark:border-gray-600 ml-4 mt-5">
        <div className="absolute -left-3 top-2 flex items-center justify-center w-6 h-6 bg-white border-2 border-green-500 rounded-full z-10">
          <FiCheckCircle className="text-green-500 size-4" />
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">
            10 Juni 2025 • 08:03
          </p>
          <p className="text-md font-medium text-gray-800 dark:text-white mb-1">
            Gendis Ariesta
          </p>
          <Badge color="success" size="sm">
            Research and Development
          </Badge>
        </div>
      </div>
      <div className="relative pl-6 border-l-2 border-gray-300 dark:border-gray-600 ml-4 mt-5">
        <div className="absolute -left-3 top-2 flex items-center justify-center w-6 h-6 bg-white border-2 border-green-500 rounded-full z-10">
          <FiCheckCircle className="text-green-500 size-4" />
        </div>
        <div className="ml-4">
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">
            10 Juni 2025 • 08:03
          </p>
          <p className="text-md font-medium text-gray-800 dark:text-white mb-1">
            Gendis Ariesta
          </p>
          <Badge color="success" size="sm">
            Research and Development
          </Badge>
        </div>
      </div>
    </div>
  );
};
