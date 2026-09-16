import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      <p className="mt-4 text-sm text-gray-400">{message}</p>
    </div>
  );
}
