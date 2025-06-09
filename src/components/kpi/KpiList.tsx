"use client";
import React from "react";
type KpiListProps = {
    data: { [key: string]: any }[];
}
export default function KpiList(props: KpiListProps) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] xl:w-2/7">
            <div className="relative w-full mb-5">
                <form>
                    <input placeholder="Search Data..."
                        className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[42px] pr-3.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                        type="text" />
                </form>
            </div>
            <div className="space-y-1">
                {props.data.sort((a, b) => a.nama.localeCompare(b.nama)).map((e, i) => (
                    <a href={"?divisi="+e.nama} key={i} className="flex cursor-pointer items-center gap-3 rounded-lg bg-gray-100 p-2 hover:bg-gray-100 dark:bg-white/[0.03] dark:hover:bg-white/[0.03]">
                        <div>
                            <span className="text-md font-medium text-gray-800 dark:text-white/90">{e.nama}</span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
}
