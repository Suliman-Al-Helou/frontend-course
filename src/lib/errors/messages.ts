import { ERROR_CODES, SUCCESS_CODES, type ErrorCode, type SuccessCode } from "./codes";

// Record<ErrorCode, string> بيجبر TypeScript يرفض أي كود ناقص رسالة
export const ERROR_MESSAGES_AR: Record<ErrorCode, string> = {
  [ERROR_CODES.AUTH_FIELDS_REQUIRED]: "يرجى ملء جميع الحقول الإلزامية للمتابعة.",
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  [ERROR_CODES.AUTH_SESSION_EXPIRED]: "انتهت صلاحية الجلسة، يرجى إعادة تسجيل الدخول.",
  [ERROR_CODES.AUTH_EMAIL_TAKEN]: "هذا البريد الإلكتروني مسجل بالفعل.",
  [ERROR_CODES.AUTH_UNAUTHORIZED_ROLE]: "ما إلك صلاحية الوصول لهاي الصفحة.",
  [ERROR_CODES.SYS_SERVER_DOWN]: "تعذّر الاتصال بالخادم، حاول لاحقًا.",
  [ERROR_CODES.SYS_UNKNOWN]: "صار خطأ غير متوقع، حاول مرة تانية.",
  [ERROR_CODES.SYS_VALIDATION]: "البيانات المدخلة غير صحيحة. يرجى التحقق من الحقول.", 
  [ERROR_CODES.SYS_NOT_FOUND]: "العنصر المطلوب غير موجود أو تم حذفه.",
  [ERROR_CODES.SYS_FORBIDDEN]: "عذراً، ليس لديك الصلاحية للوصول إلى هذه البيانات.",

};

export const SUCCESS_MESSAGES_AR: Record<SuccessCode, string> = {
  [SUCCESS_CODES.AUTH_LOGIN_OK]: "تم تسجيل الدخول بنجاح.",
  [SUCCESS_CODES.AUTH_REGISTER_OK]: "تم إنشاء الحساب بنجاح.",
  [SUCCESS_CODES.AUTH_LOGOUT_OK]: "تم تسجيل الخروج بنجاح.",
};