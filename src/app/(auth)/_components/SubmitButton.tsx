import { Button } from "@/components/ui/button";

interface Props {
  loading: boolean;
  loadingText: string;
  children: React.ReactNode;
}

export function SubmitButton({ loading, loadingText, children }: Props) {
  return (
    <Button
      type="submit"
      loading={loading}
      disabled={loading}
      size="default"
      className="w-full h-11 min-h-[44px] font-semibold text-base shadow-xs"
    >
      {loading ? loadingText : children}
    </Button>
  );
}
