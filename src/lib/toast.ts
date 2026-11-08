import { toast } from "sonner";
import { ERROR_MESSAGES_AR, SUCCESS_MESSAGES_AR } from "./errors/messages";
import type { ErrorCode, SuccessCode } from "./errors/codes";
import { ApiError } from "./errors/ApiError";

export const notify = {
  success: (code: SuccessCode) => toast.success(SUCCESS_MESSAGES_AR[code]),

  error: (input: ApiError | ErrorCode) => {
    const message = input instanceof ApiError ? input.message : ERROR_MESSAGES_AR[input];
    toast.error(message);
  },
};