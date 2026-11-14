import * as React from "react";
import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-xs",
        outline:
          "border border-border bg-background text-foreground hover:bg-muted hover:text-foreground",
        outlinePrimary: "border border-primary text-primary bg-background hover:bg-primary/10",
        outlineDestructive:
          "border border-destructive/40 bg-background text-destructive hover:bg-destructive/10",
        outlineWarning: "border border-warning/40 bg-background text-warning hover:bg-warning/10",
        outlineSuccess: "border border-success/40 bg-background text-success hover:bg-success/10",
        secondary: "bg-muted text-foreground hover:bg-muted/70",
        ghost: "text-foreground hover:bg-muted",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 min-h-[36px] px-3.5 text-xs rounded-lg [&_svg]:size-4",
        default: "h-11 min-h-[44px] px-5 text-sm rounded-xl [&_svg]:size-4",
        lg: "h-12 min-h-[48px] px-6 text-base rounded-xl [&_svg]:size-5",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px] p-0 rounded-xl [&_svg]:size-5",
        iconSm: "h-9 w-9 min-h-[36px] min-w-[36px] p-0 rounded-lg [&_svg]:size-4",
      },
    },
    compoundVariants: [{ variant: "link", className: "h-auto px-0 min-h-0" }],
    defaultVariants: { variant: "default", size: "default" },
  },
);

type StyleProps = VariantProps<typeof buttonVariants>;

type ButtonAsButton = StyleProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
    asChild?: boolean;
    loading?: boolean;
  };

type ButtonAsLink = StyleProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    disabled?: boolean;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    // ---- رابط ----
    if (props.href !== undefined) {
      const { href, className, variant, size, disabled, ...anchorProps } = props;
      const common = {
        className: cn(buttonVariants({ variant, size, className })),
        "aria-disabled": disabled || undefined,
        tabIndex: disabled ? -1 : undefined,
      };
      const isExternal = /^(https?:|mailto:|tel:)/.test(href);

      return isExternal ? (
        <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...common} {...anchorProps} />
      ) : (
        <Link ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...common} {...anchorProps} />
      );
    }

    // ---- زر ----
    const {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      ...rest
    } = props;
    const classes = cn(buttonVariants({ variant, size, className }));

    if (asChild) {
      return (
        <Slot className={classes} ref={ref as React.Ref<HTMLElement>} {...rest}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={classes}
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading && <Loader2 className="animate-spin motion-reduce:animate-none" aria-hidden />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
