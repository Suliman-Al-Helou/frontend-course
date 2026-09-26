import { mapApiError } from './mapApiError';
import { notify } from '@/lib/toast';

import { LARAVEL_FIELD_MAP } from './fieldNameMap';

export function handleFormError(
  err: unknown,
  setFieldErrors: (v: Record<string, string>) => void,
  setError: (v: string) => void,
) {
  const apiError = mapApiError(err);
  if (apiError.fieldErrors) {
    const flat: Record<string, string> = {};
    Object.entries(apiError.fieldErrors).forEach(([field, messages]) => {
      const mappedField = LARAVEL_FIELD_MAP[field] ?? field;
      flat[mappedField] = messages[0];
    });
    setFieldErrors(flat);
  } else {
    notify.error(apiError);
    setError(apiError.message);
  }
}