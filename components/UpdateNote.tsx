import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { Note } from "@prisma/client";
import { useState } from "react";

interface UpdateNoteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: Note;
}

const UpdateNote = ({ open, setOpen, noteToEdit }: UpdateNoteProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
    },
  });

  async function onSubmit(values: CreateNoteSchema) {
    try {
      if (noteToEdit) {
        const response = await fetch("/api/note", {
          method: "PUT",
          body: JSON.stringify({
            id: noteToEdit.id,
            ...values,
          }),
        });

        if (!response.ok) {
          throw Error("status code : " + response.status);
        }
      } else {
        const response = await fetch("/api/note", {
          method: "POST",
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw Error("status code : " + response.status);
        }
      }

      form.reset();

      toast({
        title: "Note Updated",
      });

      router.refresh();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleDelete = async () => {
    if (!noteToEdit) return;

    setIsDeleting(true);

    try {
      const response = await fetch("/api/note", {
        method: "DELETE",
        body: JSON.stringify({
          id: noteToEdit.id,
        }),
      });

      if (!response.ok) {
        throw Error("status code : " + response.status);
      }

      toast({
        title: "Note Deleted",
      });

      router.refresh();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Something went wrong.",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Edit Note</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Edit title"
                      className="transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Edit content"
                      className="transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full text-gray-50"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Update"
                )}
              </Button>
              {noteToEdit && (
                <Button
                  variant={"destructive"}
                  onClick={handleDelete}
                  type="button"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Delete Note"
                  )}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateNote;
