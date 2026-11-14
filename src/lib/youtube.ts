/**
 * أداة مساعدة لاستخراج معرف فيديو YouTube من أي رابط أو نص مدخل
 */
export function extractYouTubeVideoId(input: string): string {
  if (!input) return "";
  const trimmed = input.trim();
  if (!trimmed) return "";

  // إذا كان المدخل هو المعرف المجرد بالفعل (11 حرف)
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // فحص أنماط روابط يوتيوب المختلفة (watch, youtu.be, embed, shorts, v)
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/,
  );

  if (match && match[1]) {
    return match[1];
  }

  // محاولة التحليل عبر معايير الـ URL كإجراء احتياطي
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const vParam = url.searchParams.get("v");
    if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
      return vParam;
    }
  } catch {
    // ليس عنوان URL صالحاً
  }

  return trimmed;
}
