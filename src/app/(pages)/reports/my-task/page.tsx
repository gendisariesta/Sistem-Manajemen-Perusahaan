import PageBreadcrumb from "@/components/PageBreadCrumb";
import TabContent from "@/components/task/TabContent";
import Content from "@/components/task/Content";
import React from "react";

export default async function MyTask() {
  const res = await fetch(`http://localhost:3000/api/tugas`, {
    cache: 'no-store',
  });
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
        <TabContent tipe="personal" todo={counts.todo} progress={counts.progress} completed={counts.complete} />
        <Content
          number={data.length}
          tipe="personal"
          data={data}
        />
      </div>
    </div>
  );
}
