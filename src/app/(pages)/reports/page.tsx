import PageBreadcrumb from "@/components/PageBreadCrumb";
import TabContent from "@/components/task/TabContent";
import Content from "@/components/task/Content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Summary | Goolaya Company",
  description:
    "Halaman Report untuk semua Divisi Goolaya Company",
};


export default async function TaskSummary() {
  const res = await fetch(`${process.env.API_URL}/tugas`, {cache: 'no-store'});
  const result = await res.json();
  const data = result.data || [];
  const counts = data.reduce(
    (acc: any, item: any) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    { todo: 0, progress: 0, complete: 0 }
  );
  return (
    <div>
      <PageBreadcrumb pageTitle="Blank Page" />
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <TabContent tipe="all" todo={counts.todo} progress={counts.progress} completed={counts.complete} />
        <Content
          number={data.length}
          tipe="all"
          data={data}
        />
      </div>
    </div>
  );
}
