import { type ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "border border-[var(--color-accent-dark)] bg-[var(--color-accent)] text-white shadow-[0_6px_18px_rgba(126,92,25,0.24)] hover:bg-[var(--color-accent-light)]",
  secondary:
    "bg-[var(--color-surface-muted)] text-primary border border-primary/30 hover:bg-primary/10",
  ghost:
    "bg-transparent text-primary hover:bg-primary/10 border-0",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", fullWidth, className = "", children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={`
        inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-medium
        transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none
        ${variantClasses[variant]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";
