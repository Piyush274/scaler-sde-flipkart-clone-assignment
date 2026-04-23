import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  note?: string;
}

const LoadingSpinner = ({
  message = "Loading products...",
  note,
}: LoadingSpinnerProps) => {
  return (
    <div className="flex min-h-[45vh] flex-col items-center justify-center gap-3 px-4 text-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-base font-medium text-foreground">{message}</p>
      {note ? <p className="max-w-xl text-sm text-muted-foreground">{note}</p> : null}
    </div>
  );
};

export default LoadingSpinner;
