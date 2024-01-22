"use client";

import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import AddNote from "../AddNote";
import { ModeToggle } from "../ui/mode-toggle";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import AIChatButton from "../AIChatButton";

const Navbar = () => {
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { theme } = useTheme();

  return (
    <>
      <div className="p-4 shadow dark:shadow-gray-800/75">
        <div className="flex flex-wrap justify-between gap-3 px-1.5 sm:px-12">
          <Link href={"/"} className="flex items-center gap-2">
            <Image src={"/logo.png"} alt="logo" width={42} height={42} />
            <span className="font-bold">QuantumNotes</span>
          </Link>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                baseTheme: theme === "dark" ? dark : undefined,
                elements: { avatarBox: { width: "2.5rem", height: "2.5rem" } },
              }}
            />
            <Button
              onClick={() => setShowDialog(true)}
              className="text-gray-50"
            >
              <PlusCircle size={18} className="mr-1.5" />
              Add Note
            </Button>
            <AIChatButton />
          </div>
        </div>
      </div>
      <AddNote open={showDialog} setOpen={setShowDialog} />
    </>
  );
};

export default Navbar;
