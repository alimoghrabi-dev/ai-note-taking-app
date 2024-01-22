import Navbar from "@/components/root/Navbar";
import { Toaster } from "@/components/ui/toaster";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster />
      <Navbar />
      <main className="m-auto max-w-7xl p-4">{children}</main>
    </>
  );
};

export default Layout;
