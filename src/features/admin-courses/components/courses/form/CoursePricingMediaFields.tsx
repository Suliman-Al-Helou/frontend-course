"use client";

import { useState } from "react";
import { Image as ImageIcon, AlertCircle, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  rating: number;
  price: number;
  totalDuration: number;
  coverImage: string;
  isPopular: boolean;
  isPublic: boolean;
  onRatingChange: (val: number) => void;
  onPriceChange: (val: number) => void;
  onDurationChange: (val: number) => void;
  onCoverImageChange: (val: string) => void;
  onIsPopularChange: (val: boolean) => void;
  onIsPublicChange: (val: boolean) => void;
}

export default function CoursePricingMediaFields({
  rating,
  price,
  totalDuration,
  coverImage,
  isPopular,
  isPublic,
  onRatingChange,
  onPriceChange,
  onDurationChange,
  onCoverImageChange,
  onIsPopularChange,
  onIsPublicChange,
}: Props) {
  const [imageLoadError, setImageLoadError] = useState(false);

  return (
    <div className="space-y-4">
      {/* التقييم + السعر */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="course-rating-input">
            التقييم الافتراضي (1.0 - 5.0)
          </Label>
          <Input
            id="course-rating-input"
            type="number"
            min="1"
            max="5"
            step="0.1"
            dir="ltr"
            value={rating}
            onChange={(e) => onRatingChange(Number.parseFloat(e.target.value) || 0)}
            className="font-mono text-right"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="course-price-input">
            السعر بالدولار ($)
          </Label>
          <div className="relative">
            <Input
              id="course-price-input"
              type="number"
              min="0"
              step="0.01"
              dir="ltr"
              disabled={isPublic}
              value={price}
              onChange={(e) => onPriceChange(Math.max(0, Number.parseFloat(e.target.value) || 0))}
              className="pl-8 font-mono text-right"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">
              $
            </span>
          </div>
          {isPublic && (
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              هذا الكورس مجاني ومتاح للعامة، السعر مقفل على 0$
            </p>
          )}
        </div>
      </div>

      {/* مدة الكورس */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="course-duration-input">
            المدة الإجمالية للكورس (بالدقائق)
          </Label>
          {totalDuration > 0 && (
            <span className="text-xs text-primary font-bold">
              ~ {Math.round(totalDuration / 60)} ساعة
            </span>
          )}
        </div>
        <Input
          id="course-duration-input"
          type="number"
          min="0"
          dir="ltr"
          value={Math.round(totalDuration / 60)}
          onChange={(e) =>
            onDurationChange(Math.max(0, Number.parseInt(e.target.value, 10) || 0) * 60)
          }
          className="font-mono text-right"
        />
      </div>

      {/* رابط صورة الغلاف مع BiDi وعزل المعاينة */}
      <div className="space-y-2">
        <Label htmlFor="course-cover-input">
          رابط صورة الغلاف (URL)
        </Label>
        <div className="relative">
          <Input
            id="course-cover-input"
            type="url"
            dir="ltr"
            placeholder="https://images.unsplash.com/photo-..."
            value={coverImage}
            onChange={(e) => {
              onCoverImageChange(e.target.value);
              setImageLoadError(false);
            }}
            className="font-mono text-left"
          />
          {coverImage && (
            <button
              type="button"
              onClick={() => {
                onCoverImageChange("");
                setImageLoadError(false);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive p-1 rounded-lg"
              title="مسح رابط الصورة"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* صندوق المعاينة المحصن */}
        {coverImage ? (
          <div className="mt-2 rounded-xl border border-border overflow-hidden bg-muted/40 relative">
            {imageLoadError ? (
              <div className="p-4 flex items-center justify-center gap-2 text-destructive text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>تعذر تحميل رابط الصورة. تأكد من صحة الرابط.</span>
              </div>
            ) : (
              <div className="relative w-full h-36">
                <img
                  src={coverImage}
                  alt="معاينة غلاف الكورس"
                  className="w-full h-full object-cover"
                  onError={() => setImageLoadError(true)}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-muted-foreground p-3 bg-muted/20 rounded-xl border border-dashed border-border">
            <ImageIcon className="w-4 h-4 shrink-0 text-muted-foreground/60" />
            <span>أدخل رابط الصورة بالأعلى لعرض معاينة الغلاف قبل النشر.</span>
          </div>
        )}
      </div>

      {/* خيارات الأكثر طلباً ومجاني */}
      <div className="grid sm:grid-cols-2 gap-3 pt-1">
        <label
          htmlFor="course-is-popular"
          className="flex items-center gap-3 p-3.5 bg-muted/30 border border-border/60 rounded-xl cursor-pointer hover:bg-muted/50 hover:border-border transition-all select-none"
        >
          <input
            id="course-is-popular"
            type="checkbox"
            checked={isPopular}
            onChange={(e) => onIsPopularChange(e.target.checked)}
            className="w-5 h-5 rounded text-primary focus:ring-primary/20"
            aria-label="الأكثر طلباً (Popular)"
          />
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">🔥 الأكثر طلباً </span>
            <span className="text-[11px] text-muted-foreground">
              يظهر بشارة مميزة في صفحة الهبوط والكتالوج
            </span>
          </span>
        </label>

        <label
          htmlFor="course-is-public"
          className="flex items-center gap-3 p-3.5 bg-muted/30 border border-border/60 rounded-xl cursor-pointer hover:bg-muted/50 hover:border-border transition-all select-none"
        >
          <input
            id="course-is-public"
            type="checkbox"
            checked={isPublic}
            onChange={(e) => {
              const checked = e.target.checked;
              onIsPublicChange(checked);
              if (checked) {
                onPriceChange(0);
              }
            }}
            className="w-5 h-5 rounded text-primary focus:ring-primary/20"
            aria-label="كورس مجاني (Public Access)"
          />
          <span className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              كورس مجاني (Public Access)
            </span>
            <span className="text-[11px] text-muted-foreground">
              متاح للطلاب بدون اشتراك أو موافقة دفع
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}
