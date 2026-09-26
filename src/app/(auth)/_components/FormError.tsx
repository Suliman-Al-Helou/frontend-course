export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="bg-destructive/10 text-destructive text-sm rounded-xl px-4 py-3 border border-destructive/20">
      {message}
    </div>
  );
}