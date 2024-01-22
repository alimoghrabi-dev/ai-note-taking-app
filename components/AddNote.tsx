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

interface AddNoteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AddNote = ({ open, setOpen }: AddNoteProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  async function onSubmit(values: CreateNoteSchema) {
    try {
      const response = await fetch("/api/note", {
        method: "POST",
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw Error("status code : " + response.status);
      }

      form.reset();

      toast({
        title: "Note created",
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Add Note</DialogTitle>
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
                      placeholder="Add a title"
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
                      placeholder="Add content"
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
                className="mt-1.5 w-full text-gray-50"
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNote;
