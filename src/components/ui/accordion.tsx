"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionContextValue {
  expandedItems: Set<string>;
  toggleItem: (value: string) => void;
  type?: "single" | "multiple";
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion components must be used within an Accordion root");
  }
  return context;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
}

export function Accordion({
  type = "single",
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: AccordionProps) {
  const [internalExpanded, setInternalExpanded] = React.useState<Set<string>>(() => {
    const initial = value ?? defaultValue;
    if (!initial) return new Set();
    return new Set(Array.isArray(initial) ? initial : [initial]);
  });

  const isControlled = value !== undefined;
  const currentExpanded = isControlled
    ? new Set(Array.isArray(value) ? value : value ? [value] : [])
    : internalExpanded;

  const toggleItem = React.useCallback(
    (itemValue: string) => {
      const next = new Set(currentExpanded);
      if (type === "single") {
        if (next.has(itemValue)) {
          next.clear();
        } else {
          next.clear();
          next.add(itemValue);
        }
      } else {
        if (next.has(itemValue)) {
          next.delete(itemValue);
        } else {
          next.add(itemValue);
        }
      }

      if (!isControlled) {
        setInternalExpanded(next);
      }

      if (onValueChange) {
        const result = Array.from(next);
        onValueChange(type === "single" ? (result[0] ?? "") : result);
      }
    },
    [currentExpanded, isControlled, onValueChange, type],
  );

  return (
    <AccordionContext.Provider value={{ expandedItems: currentExpanded, toggleItem, type }}>
      <div className={cn("space-y-3", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItem() {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error("AccordionTrigger and AccordionContent must be inside AccordionItem");
  }
  return context;
}

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, className, children, ...props }, ref) => {
    const { expandedItems } = useAccordion();
    const isOpen = expandedItems.has(value);
    const id = React.useId();
    const triggerId = `accordion-trigger-${id}`;
    const contentId = `accordion-content-${id}`;

    return (
      <AccordionItemContext.Provider value={{ value, isOpen, triggerId, contentId }}>
        <div
          ref={ref}
          data-state={isOpen ? "open" : "closed"}
          className={cn(
            "rounded-2xl border border-border bg-card overflow-hidden transition-colors",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);
AccordionItem.displayName = "AccordionItem";

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  chevron?: boolean;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, chevron = true, ...props }, ref) => {
    const { toggleItem } = useAccordion();
    const { value, isOpen, triggerId, contentId } = useAccordionItem();

    return (
      <button
        ref={ref}
        type="button"
        id={triggerId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        data-state={isOpen ? "open" : "closed"}
        onClick={() => toggleItem(value)}
        className={cn(
          "flex w-full min-h-[48px] items-center justify-between p-4 text-start font-semibold text-foreground transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          className,
        )}
        {...props}
      >
        <div className="flex-1 min-w-0 flex items-center justify-between gap-3 text-start">
          {children}
        </div>
        {chevron && (
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
              isOpen && "rotate-180",
            )}
            aria-hidden="true"
          />
        )}
      </button>
    );
  },
);
AccordionTrigger.displayName = "AccordionTrigger";

export interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, triggerId, contentId } = useAccordionItem();

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        data-state={isOpen ? "open" : "closed"}
        className={cn("border-t border-border animate-in fade-in-0 duration-200", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
AccordionContent.displayName = "AccordionContent";
