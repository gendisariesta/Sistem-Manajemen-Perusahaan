"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Dropdown } from "@/components/ui/Dropdown";
import { FiChevronDown, FiLogOut, FiUser  } from "react-icons/fi";


export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<Record<string, string>>({});
   useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/auth');
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
      }
    }
    fetchUser();
  }, []);
  
  function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }

  function closeDropdown() {
    setIsOpen(false);
  }
  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400 dropdown-toggle"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image
            width={44}
            height={44}
            src={"/uploads/"+user?.foto_profil}
            alt="User"
          />
        </span>

        <span className="block mr-1 font-medium text-theme-sm">{user?.email}</span>
        <FiChevronDown  className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user?.nama}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email}
          </span>
        </div>

       <Link
          href="/profile"
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
          <FiUser className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300" />
          Profil
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
          <FiLogOut className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300" />
          Sign out
        </Link>
      </Dropdown>
    </div>
  );
}
