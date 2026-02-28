import { cn } from "@/lib/utils";

type TextVariant = "body" | "meta";

interface TextProps {
  variant?: TextVariant;
  children: React.ReactNode;
  className?: string;
  as?: "p" | "span" | "div";
}

const variantClasses: Record<TextVariant, string> = {
  body: "text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed",
  meta: "text-xs font-mono text-neutral-450 dark:text-neutral-500",
};

export function Text({
  variant = "body",
  children,
  className,
  as: Tag = "p",
}: TextProps) {
  return (
    <Tag className={cn(variantClasses[variant], className)}>{children}</Tag>
  );
}
