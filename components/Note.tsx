"use client";

import { Note as NoteModel } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useState } from "react";
import UpdateNote from "./UpdateNote";

interface NoteProps {
  note: NoteModel;
}
const Note = ({ note }: NoteProps) => {
  const [showEdit, setShowEdit] = useState<boolean>(false);

  const wasUpdated = note.updatedAt > note.createdAt;

  const createdUpdatedTimestamps = (
    wasUpdated ? note.updatedAt : note.createdAt
  ).toDateString();

  return (
    <>
      <Card
        onClick={() => setShowEdit(true)}
        className="cursor-pointer border-slate-300 transition-shadow hover:shadow-lg dark:border-slate-800/80"
      >
        <CardHeader>
          <CardTitle>{note.title}</CardTitle>
          <CardDescription>
            {createdUpdatedTimestamps}
            {wasUpdated && " (updated)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{note.content}</p>
        </CardContent>
      </Card>
      <UpdateNote open={showEdit} setOpen={setShowEdit} noteToEdit={note} />
    </>
  );
};

export default Note;
