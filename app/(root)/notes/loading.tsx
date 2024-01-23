import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="grid justify-items-center gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index}>
          <Skeleton className="h-[170px] w-[300px] bg-gray-900/20 dark:bg-gray-100/10" />
        </div>
      ))}
    </div>
  );
};

export default Loading;
