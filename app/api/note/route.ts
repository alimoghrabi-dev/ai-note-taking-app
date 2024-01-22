import { getEmbedding } from "@/lib/openai";
import { notesIndex } from "@/lib/pinecone";
import prisma from "@/lib/prisma-db";
import {
  createNoteSchema,
  deleteNoteSchema,
  updateNoteSchema,
} from "@/lib/validation/note";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const parseResult = createNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return new NextResponse("Invalid Request", { status: 400 });
    }

    const { title, content } = parseResult.data;

    const embedding = await getEmbeddingForNote(title, content);

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: {
          title,
          content,
          userId,
        },
      });

      await notesIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: {
            userId,
          },
        },
      ]);

      return note;
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const parseResult = updateNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return new NextResponse("Invalid Request", { status: 400 });
    }

    const { id, title, content } = parseResult.data;

    const note = await prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!userId || userId !== note?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!note) {
      return new NextResponse("Note not found", { status: 404 });
    }

    const embedding = await getEmbeddingForNote(title, content);

    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.note.update({
        where: {
          id,
        },
        data: {
          title,
          content,
        },
      });

      await notesIndex.upsert([
        {
          id,
          values: embedding,
          metadata: {
            userId,
          },
        },
      ]);

      return updatedNote;
    });

    return NextResponse.json({ updatedNote }, { status: 201 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const parseResult = deleteNoteSchema.safeParse(body);

    if (!parseResult.success) {
      console.error(parseResult.error);
      return new NextResponse("Invalid Request", { status: 400 });
    }

    const { id } = parseResult.data;

    const note = await prisma.note.findUnique({
      where: {
        id,
      },
    });

    if (!userId || userId !== note?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!note) {
      return new NextResponse("Note not found", { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.note.delete({
        where: {
          id,
        },
      });

      await notesIndex.deleteOne(id);
    });

    return NextResponse.json(
      { message: "Note deleted successfully" },
      { status: 201 },
    );
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

async function getEmbeddingForNote(title: String, content: string | undefined) {
  return getEmbedding(title + "\n\n" + content ?? "");
}
