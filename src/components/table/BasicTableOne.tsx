"use client";
import React, { useState, useMemo, Suspense } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import Input from "@/components/form/InputField";
import Button from "@/components/ui/Button";

type TableProps = {
  columns: string[];
  data: { [key: string]: any }[];
};

export default function BasicTableOne({ columns, data }: TableProps) {
  const [filterText, setFilterText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // 🔧 Dinamis!

  // Filtered data based on search input
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      columns.some((col) =>
        String(item[col] ?? "")
          .toLowerCase()
          .includes(filterText.toLowerCase())
      )
    );
  }, [data, columns, filterText]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-2 px-4 py-4 border border-b-1 border-gray-100 dark:border-white/[0.05] rounded-t-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-gray-500 dark:text-gray-400">
              Show
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparant dark:text-white p-2 text-sm border border-gray-300 rounded-lg"
            >
              <option value={10} className="dark:bg-gray-900 dark:text-gray-400">10</option>
              <option value={20} className="dark:bg-gray-900 dark:text-gray-400">20</option>
              <option value={50} className="dark:bg-gray-900 dark:text-gray-400">50</option>
            </select>
          </div>
          <Input
            placeholder="Search..."
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-sm"
          />
        </div>
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[920px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-large text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    No
                  </TableCell>
                  {columns.map((col,i) => (
                    <TableCell
                      key={i}
                      isHeader
                      className="px-5 py-3 font-large text-gray-500 text-start text-theme-sm dark:text-gray-400"
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {paginatedData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      <TableCell className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {(currentPage - 1) * itemsPerPage + rowIndex + 1}
                      </TableCell>
                      {columns.map((col, i) => (
                        <TableCell
                          key={i}
                          className="px-5 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
                        >
                          {row[col] || '-'}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between mt-4 flex-wrap gap-2">
        <div className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center flex-wrap gap-1">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {/* Page Number Buttons */}
          {(() => {
            const pageButtons = [];
            const maxButtons = 5;
            let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
            let endPage = startPage + maxButtons - 1;

            if (endPage > totalPages) {
              endPage = totalPages;
              startPage = Math.max(1, endPage - maxButtons + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
              pageButtons.push(
                <Button
                  key={i}
                  variant={currentPage === i ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i)}
                >
                  {i}
                </Button>
              );
            }

            return pageButtons;
          })()}

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div >
  );
}
