"use client"
import { useModal } from "@/hooks/useModal";
import Input from "../form/InputField";
import Label from "../form/Label";
import Button from "../ui/Button";
import { Modal } from "../ui/Modal";
import { useCallback, useEffect, useState } from "react";
import DatePicker from "../form/date-picker";
import Select from "../form/Select";
import { useSearchParams, useRouter } from "next/navigation";
type TabProps = {
  tipe: string;
  todo:number;
  progress:number;
  completed:number
};
export default function TabContent(props:TabProps) {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");
  const all = (props.completed+props.progress+props.todo);
  type OptionType = { value: string; label: string; foto?: string; };
  const { isOpen, openModal, closeModal } = useModal();
  const [items, setItems] = useState<Record<string, any>>({});
  const [divisiOptions, setDivisiOptions] = useState<OptionType[]>([]);
  const [userOptions, setUserOptions] = useState<OptionType[]>([]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItems((prev) => ({ ...prev, [name]: value }));
  };
  const handleDate = (name: string, value: string) => {
    setItems(prev => ({ ...prev, [name]: value }));
  }
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/divisi', { cache: "no-store" });
      const getData = await res.json();
      const data = getData.data.map((item: any) => ({
        value: item.id,
        label: item.nama,
      }
      ))
      setDivisiOptions(data);
    })();
  }, []);
  const handleSelectChange = (name: string) => (value: string) => {
    if (name == 'user') {
      setItems(prev => ({
        ...prev,
        [`foto_profil`]: userOptions.find(option => option.value === value)?.foto || '',
        [`assign_to_id`]: value,
        [`assign_to_nama`]: userOptions.find(option => option.value === value)?.label || ''
      }));
    } else {
      setItems(prev => ({
        ...prev,
        [`${name}_id`]: value,
        [`${name}_nama`]: divisiOptions.find(option => option.value === value)?.label || ''
      }));
      fetchUser(value);
    }
  };
  const fetchUser = useCallback(async (divisiId: string) => {
    const res = await fetch('/api/users?divisi_id=' + divisiId, { cache: "no-store" });
    const getData = await res.json();
    const data = getData.data.map((item: any) => ({
      value: item.id,
      label: item.nama,
      foto: item.foto_profil,
    }));
    setUserOptions(data);
  }, [handleSelectChange]);

  useEffect(() => {
    if (isOpen) {
      const date = new Date();
      setItems({
        assign_time: date.toLocaleDateString('en-GB').split('/').join('-'),
        status: 'todo',
      });
    }
  }, [isOpen]);

  const router = useRouter()
  const handleSave = async () => {
    closeModal();
    try {
      const res = await fetch(`/api/tugas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(items),
      });
      router.refresh();
      if (!res.ok) throw new Error("Failed to submit form");
    } catch (err) {
      console.error("Submit error:", err);
    }
  };
  // inline-flex items-center xl:justify-start justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md group hover:text-gray-900 dark:hover:text-white text-gray-900 dark:text-white bg-white dark:bg-gray-800
  // inline-flex items-center xl:justify-start justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md group hover:text-gray-900 dark:hover:text-white text-gray-500 dark:text-gray-400
  return (
    <>
      <div className="flex flex-col items-center px-4 py-5 xl:px-6 xl:py-6">
        <div className="flex flex-col w-full gap-5 sm:justify-between xl:flex-row xl:items-center">
          <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-x-1 gap-y-2 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
            <a href={props.tipe == 'all' ? "/reports" : "/reports/my-task"} className={`inline-flex items-center xl:justify-start justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md group hover:text-gray-900 dark:hover:text-white
            ${!currentTab
                ? "text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                : "text-gray-500 dark:text-gray-400"}`} >All Tasks
              <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium leading-normal group-hover:bg-brand-50 group-hover:text-brand-500 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-400 text-brand-500 dark:text-brand-400 bg-brand-50 dark:bg-brand-500/15">{all}</span>
            </a>
            <a href="?tab=todo" className={`inline-flex items-center xl:justify-start justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md group hover:text-gray-900 dark:hover:text-white
            ${currentTab === "todo"
                ? "text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                : "text-gray-500 dark:text-gray-400"}`}>To do
              <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium leading-normal group-hover:bg-brand-50 group-hover:text-brand-500 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-400 bg-white dark:bg-white/[0.03]">{props.todo}</span>
            </a>
            <a href="?tab=progress" className={`inline-flex items-center xl:justify-start justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md group hover:text-gray-900 dark:hover:text-white
            ${currentTab === "progress"
                ? "text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                : "text-gray-500 dark:text-gray-400"}`}>In Progress
              <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium leading-normal group-hover:bg-brand-50 group-hover:text-brand-500 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-400 bg-white dark:bg-white/[0.03]">{props.progress}</span>
            </a>
            <a href="?tab=completed" className={`inline-flex items-center xl:justify-start justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md group hover:text-gray-900 dark:hover:text-white
            ${currentTab === "completed"
                ? "text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                : "text-gray-500 dark:text-gray-400"}`}>Completed
              <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium leading-normal group-hover:bg-brand-50 group-hover:text-brand-500 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-400 bg-white dark:bg-white/[0.03]">{props.completed}</span>
            </a>
          </div>
          {props.tipe == 'all' && (
            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <Button onClick={openModal} size="sm" variant="primary">Add New Task</Button>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Tambah Tugas
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[350px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-1 lg:col-span-2">
                    <Label>Judul Tugas</Label>
                    <Input type="text"
                      name="title"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-span-1 lg:col-span-2">
                    <DatePicker
                      id="deadline"
                      label="Deadline"
                      placeholder="Pilih Tanggal"
                      name="deadline"
                      required
                      onChange={(dates, currentDateString) => {
                        handleDate("deadline", currentDateString);
                      }}
                    />
                  </div>
                  <h4 className="mb-0 col-span-1 lg:col-span-2 text-md font-semibold text-gray-800 dark:text-white/90">
                    Assign To
                  </h4>
                  <div className="col-span-1 lg:col-span-1">
                    <Label>Divisi</Label>
                    <Select
                      options={divisiOptions}
                      placeholder="Select an option"
                      name="divisi"
                      onChange={handleSelectChange("divisi")}
                      className="dark:bg-dark-900"
                      required
                    />
                  </div>
                  <div className="col-span-1 lg:col-span-1">
                    <Label>Karyawan</Label>
                    <Select
                      options={userOptions}
                      placeholder="Select an option"
                      name="assign_to"
                      onChange={handleSelectChange("user")}
                      className="dark:bg-dark-900"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  )
}