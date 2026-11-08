import { ERROR_CODES, type ErrorCode } from "./codes";
import { ERROR_MESSAGES_AR } from "./messages";

export class ApiError extends Error {
  code: ErrorCode;
  status: number;
  fieldErrors?: Record<string, string[]>; // من Laravel validation (422)

  constructor(code: ErrorCode, status: number, fieldErrors?: Record<string, string[]>) {
    super(ERROR_MESSAGES_AR[code]);
    this.code = code;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}