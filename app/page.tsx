import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  const { userId } = auth();

  if (userId) redirect("/notes");

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image src={"/logo.png"} alt="logo" width={96} height={96} />
        <span className="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
          QuantumNotes
        </span>
      </div>
      <p className="font-sm max-w-sm text-center text-gray-700 sm:max-w-prose">
        An Intelligent note taking app with AI integration, build with OpenAI,
        Pinecone, Next.js, and more.
      </p>
      <Link href={"/notes"} className={cn(buttonVariants({ size: "lg" }))}>
        Open
      </Link>
    </main>
  );
}
