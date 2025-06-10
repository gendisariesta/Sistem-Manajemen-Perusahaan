import { ClipLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[100vh]">
      <div className="text-center">
        <ClipLoader size={70} color="color-brand-500" />
        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading data...</p>
      </div>
    </div>
  );
}
