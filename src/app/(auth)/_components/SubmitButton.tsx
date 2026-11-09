import { Loader2 } from "lucide-react";

interface Props {
  loading: boolean;
  loadingText: string;
  children: React.ReactNode;
}

export function SubmitButton({ loading, loadingText, children }: Props) {
  return (
    <button
      type="submit"
      disabled={loading}
      aria-busy={loading}
      onClick={(e) => {
        if (loading) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 active:scale-[0.99]"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
