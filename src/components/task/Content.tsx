'use client';

import { FiCalendar, FiMoreHorizontal } from "react-icons/fi";
import Badge from "../ui/Badge";
import Image from "next/image";
import { Dropdown } from "@/components/ui/Dropdown";
import { DropdownItem } from "@/components/ui/DropdownItem";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type ContentProps = {
  number: number;
  tipe: string;
  data: { [key: string]: any }[];
};

export default function Content(props: ContentProps) {
  const [todoData, setTodoData] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [completeData, setCompleteData] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");
  useEffect(() => {
    setTodoData(props.data.filter(item => item.status === 'todo'));
    setProgressData(props.data.filter(item => item.status === 'progress'));
    setCompleteData(props.data.filter(item => item.status === 'complete'));
  }, [props.data]);

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const toggleDropdown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setOpenDropdownId(prev => (prev === id ? null : id));
  };
  const closeDropdown = () => setOpenDropdownId(null);
  const router = useRouter();

  const update = async (id: string, status: string) => {
    closeDropdown();
    const date = new Date();
    try {
      const res = await fetch('/api/tugas/id/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed_time: date.toLocaleDateString('en-GB').split('/').join('-'),
          status
        }),
      });
      if (!res.ok) throw new Error('Gagal update status');
      const result = await res.json();
      console.log('Status berhasil diubah:', result);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const renderItems = (data: any[], statusLabel: string) => (
    <div className="flex flex-col gap-5 p-4 swim-lane xl:p-6 border-t border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between mb-1">
        <h3 className="flex items-center gap-3 text-base font-medium text-gray-800 dark:text-white/90">
          {statusLabel}
          <span className="inline-flex rounded-full px-2 py-0.5 text-theme-xs font-medium bg-gray-100 text-gray-700 dark:bg-white/[0.03] dark:text-white/80">
            {data.length}
          </span>
        </h3>
      </div>
      {data.map((item, itemkey) => (
        <div key={itemkey} className="relative p-5 bg-white border border-gray-200 rounded-xl shadow-theme-sm dark:border-gray-800 dark:bg-white/5">
          <div className="space-y-4">
            <div>
              <h4 className="mr-10 text-base text-gray-800 dark:text-white/90">{item.title}</h4>
            </div>
            {props.tipe === 'personal' && (
              <>
                <button id={item.id} onClick={(e) => toggleDropdown(e, item.id)} className="absolute top-5 right-5 dark:text-white">
                  <FiMoreHorizontal />
                </button>
                <Dropdown isOpen={openDropdownId === item.id} onClose={closeDropdown}
                  className="absolute mt-0 right-0 flex w-[150px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark">
                  <ul className="flex flex-col gap-1">
                    <li>
                      <DropdownItem onClick={() => update(item.id, 'progress')} className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-warning-100 hover:text-warning-700 dark:text-gray-400 dark:hover:bg-warning-200 dark:hover:text-warning-500">
                        On Progress
                      </DropdownItem>
                    </li>
                    <li>
                      <DropdownItem onClick={() => update(item.id, 'complete')} className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-success-100 hover:text-success-700 dark:text-gray-400 dark:hover:bg-success-200 dark:hover:text-success-500">
                        Complete
                      </DropdownItem>
                    </li>
                  </ul>
                </Dropdown>
              </>
            )}
            <div className={`items-center text-sm text-gray-500 ${props.tipe === 'personal' ? 'flex gap-3' : ''}`}>
              <div className="flex gap-1 items-center mb-1"><FiCalendar /><p>Assign Time: </p><p>{item.assign_time}</p></div>
              <div className="flex gap-1 items-center mb-1"><FiCalendar /><p>Deadline: </p><p>{item.deadline}</p></div>
            </div>
            <div className="flex gap-3 items-center text-sm text-gray-500">
              <Badge>{item.divisi_nama}</Badge>
              <div className={`h-7 w-full max-w-7 overflow-hidden rounded-full border-[0.5px] border-gray-200 dark:border-gray-800 
                ${props.tipe === 'all' && (!searchParams.has('tab'))? 'absolute top-5 right-5 top' : ''}`}>
                <Image width={50} height={50} src={'/uploads/' + item.foto_profil} alt="user" />
              </div>
              {props.tipe === 'personal' && <p>{item.assign_to_nama}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const shouldRender = (tabValue: string | null, status: string) => {
    return tabValue === null || tabValue === status;
  };

  return (
    <div className={props.tipe === 'all' && (!searchParams.has('tab'))
      ? "grid grid-cols-1 divide-x divide-gray-200 dark:divide-white/[0.05] mt-7 sm:mt-0 sm:grid-cols-2 xl:grid-cols-3"
      : ""}>
      {shouldRender(currentTab, 'todo') && renderItems(todoData, 'To Do')}
      {shouldRender(currentTab, 'progress') && renderItems(progressData, 'On Progress')}
      {shouldRender(currentTab, 'completed') && renderItems(completeData, 'Completed')}
    </div>
  );
}
