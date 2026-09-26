// src/lib/errors/mapApiError.ts
import { AxiosError } from "axios";
import { ERROR_CODES } from "./codes";
import { ApiError } from "./ApiError";

export function mapApiError(error: unknown): ApiError {
  if (!(error instanceof AxiosError)) return new ApiError(ERROR_CODES.SYS_UNKNOWN, 500);
  if (!error.response) return new ApiError(ERROR_CODES.SYS_SERVER_DOWN, 502);

  const { status, data } = error.response;
  const fieldErrors: Record<string, string[]> | undefined = data?.errors;

  if (status === 401) {
    return new ApiError(ERROR_CODES.AUTH_INVALID_CREDENTIALS, 401);
  }
  if (status === 403) {
    return new ApiError(ERROR_CODES.AUTH_UNAUTHORIZED_ROLE, 403);
  }
  if (status === 422 && fieldErrors) {
    if (fieldErrors.email) {
      return new ApiError(ERROR_CODES.AUTH_EMAIL_TAKEN, 422, fieldErrors);
    }
    return new ApiError(ERROR_CODES.SYS_VALIDATION, 422, fieldErrors);
  }

  return new ApiError(ERROR_CODES.SYS_UNKNOWN, status);
}