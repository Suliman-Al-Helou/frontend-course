interface Props {
  loading: boolean;
  loadingText: string;
  children: React.ReactNode;
}

export function SubmitButton({ loading, loadingText, children }: Props) {
  return (
    <button type="submit" disabled={loading}
      className="w-full h-11 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white rounded-xl font-semibold transition-colors">
      {loading ? loadingText : children}
    </button>
  );
}