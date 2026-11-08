import { ZodError } from 'zod';

export function flattenZodErrors(error: ZodError): Record<string, string> {
  const flat: Record<string, string> = {};
  error.issues.forEach(issue => {
    const field = issue.path[0] as string;
    if (!flat[field]) flat[field] = issue.message;
  });
  return flat;
}