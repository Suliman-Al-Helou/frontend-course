// src/lib/validations/auth.ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "البريد الإلكتروني مطلوب").email("صيغة البريد غير صحيحة"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, "الاسم مطلوب").min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
    email: z.string().min(1, "البريد الإلكتروني مطلوب").email("صيغة البريد غير صحيحة"),
    password: z
      .string()
      .min(1, "كلمة المرور مطلوبة")
      .min(8, "8 أحرف على الأقل")
      .regex(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
      .regex(/\d/, "يجب أن تحتوي على رقم واحد على الأقل"),
    confirm: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirm"], // الخطأ بيظهر تحت حقل confirm تحديدًا
  });