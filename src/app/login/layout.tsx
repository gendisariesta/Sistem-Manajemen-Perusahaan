import ThemeTogglerTwo from "@/components/ThemeTogglerTwo";
import { ThemeProvider } from "@/context/ThemeContext";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Login | Sistem Manajemen Karyawan",
  description: "Halaman Login Sistem Manajemen Karyawan Goolaya Company",
};
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <ThemeProvider>
        <div className="relative flex lg:flex-row w-full h-screen justify-center flex-col  dark:bg-gray-900 sm:p-0">
          {children}
          <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
