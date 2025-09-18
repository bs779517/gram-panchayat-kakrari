import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <LoaderCircle className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
