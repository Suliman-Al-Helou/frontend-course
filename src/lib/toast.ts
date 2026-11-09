import { toast } from "sonner";
import { ERROR_MESSAGES_AR, SUCCESS_MESSAGES_AR } from "./errors/messages";
import type { ErrorCode, SuccessCode } from "./errors/codes";
import { ApiError } from "./errors/ApiError";

export const notify = {
  success: (input: SuccessCode | string) => {
    const message =
      typeof input === "string" && input in SUCCESS_MESSAGES_AR
        ? SUCCESS_MESSAGES_AR[input as SuccessCode]
        : input;
    toast.success(message);
  },

  error: (input: ApiError | ErrorCode | string) => {
    if (typeof input === "string") {
      const message = input in ERROR_MESSAGES_AR ? ERROR_MESSAGES_AR[input as ErrorCode] : input;
      toast.error(message);
      return;
    }
    const message = input instanceof ApiError ? input.message : ERROR_MESSAGES_AR[input];
    toast.error(message);
  },
};
