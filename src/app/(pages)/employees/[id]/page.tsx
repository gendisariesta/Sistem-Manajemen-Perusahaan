import UserAddressCard from "@/components/UserAddressCard";
import UserInfoCard from "@/components/UserInfoCard";
import UserMetaCard from "@/components/UserMetaCard";
import React from "react";

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const res = await fetch(`${process.env.API_URL}/users/id/` + id,{cache:'no-store'});
  const result = await res.json();
  console.log(result)

  return (
    <div>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Profile
        </h3>
        <div className="space-y-6">
          <UserMetaCard data={result} />
          <UserInfoCard data={result} />
          <UserAddressCard data={result} />
        </div>
      </div>
    </div>
  );
}
