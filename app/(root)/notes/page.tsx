import Note from "@/components/Note";
import prisma from "@/lib/prisma-db";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import Loading from "./loading";

export const metadata: Metadata = {
  title: "QuantumNotes - Notes",
};

const Page = async () => {
  const { userId } = auth();

  if (!userId) throw Error("Unauthorized");

  const notes = await prisma.note.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {notes.map((note) => (
        <Note key={note.id} note={note} />
      ))}
      {notes.length === 0 && (
        <div className="col-span-full text-center text-lg font-medium text-gray-700 dark:text-gray-600">
          No Notes yet.
        </div>
      )}
    </div>
  );
};

export default Page;
