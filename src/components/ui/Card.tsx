import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ noPadding, className = "", children, ...props }, ref) => (
    <div
      ref={ref}
      className={`
        rounded-2xl bg-[var(--color-surface-card)] shadow-sm border border-[var(--color-surface-muted)]
        ${noPadding ? "" : "p-4"}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";
