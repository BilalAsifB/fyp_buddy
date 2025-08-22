// src/components/LoadingSpinner.tsx
import { Loader2 } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      <p className="mt-4 text-lg font-medium text-gray-700">
        Finding your perfect project match...
      </p>
      <p className="mt-2 text-sm text-gray-500">
        Analyzing skills, interests, and project requirements
      </p>
    </div>
  );
}
