import * as React from "react";
import { Search, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Shows a spinning indicator when active searching is in flight */
  loading?: boolean;
  /** Callback fired when the clear button is clicked */
  onClear?: () => void;
  /** Explicitly toggle clear button visibility (defaults to true when value is present) */
  showClear?: boolean;
  /** Accessible label for the clear button (defaults to "مسح البحث") */
  clearLabel?: string;
  /** Custom icon at the start (defaults to Lucide Search icon) */
  startIcon?: React.ReactNode;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      value,
      defaultValue,
      onChange,
      onClear,
      showClear = true,
      clearLabel = "مسح البحث",
      loading = false,
      disabled = false,
      startIcon,
      type = "search",
      ...props
    },
    forwardedRef,
  ) => {
    const internalRef = React.useRef<HTMLInputElement>(null);
    const [hasText, setHasText] = React.useState<boolean>(() => {
      if (value !== undefined) return Boolean(value);
      if (defaultValue !== undefined) return Boolean(defaultValue);
      return false;
    });

    // Synchronize controlled value changes
    React.useEffect(() => {
      if (value !== undefined) {
        setHasText(Boolean(value));
      }
    }, [value]);

    // Merge forwarded ref and internal ref
    const handleRef = React.useCallback(
      (element: HTMLInputElement | null) => {
        (internalRef as React.MutableRefObject<HTMLInputElement | null>).current = element;
        if (typeof forwardedRef === "function") {
          forwardedRef(element);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = element;
        }
      },
      [forwardedRef],
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setHasText(Boolean(e.target.value));
      }
      onChange?.(e);
    };

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (internalRef.current) {
        internalRef.current.value = "";
        // Dispatch synthetic change event for React form state listeners
        const event = new Event("input", { bubbles: true });
        internalRef.current.dispatchEvent(event);
        internalRef.current.focus();
      }
      if (value === undefined) {
        setHasText(false);
      }
      onClear?.();
    };

    const isClearVisible = showClear && !disabled && !loading && hasText;

    return (
      <div
        role="search"
        className={cn(
          "relative flex items-center w-full",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        {/* Leading Search Icon / Custom start icon */}
        <div
          aria-hidden="true"
          className="absolute start-0 top-0 bottom-0 w-11 flex items-center justify-center pointer-events-none text-muted-foreground"
        >
          {startIcon ?? <Search className="w-4 h-4 shrink-0" />}
        </div>

        {/* Search Input Field */}
        <input
          type={type}
          ref={handleRef}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={cn(
            "flex h-11 min-h-[44px] w-full rounded-xl border border-border bg-background ps-11 pe-11 text-base text-foreground transition-colors sm:text-sm",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
            "disabled:cursor-not-allowed",
            "motion-reduce:transition-none",
            "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
            className,
          )}
          {...props}
        />

        {/* Trailing Slot: Loading Spinner or Clear Button */}
        <div className="absolute end-0 top-0 bottom-0 w-11 flex items-center justify-center">
          {loading && (
            <Loader2
              aria-hidden="true"
              className="w-4 h-4 animate-spin text-muted-foreground motion-reduce:animate-none"
            />
          )}

          {!loading && isClearVisible && (
            <button
              type="button"
              onClick={handleClear}
              aria-label={clearLabel}
              className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none motion-reduce:transition-none"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
