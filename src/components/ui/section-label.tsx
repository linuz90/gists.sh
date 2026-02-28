import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <h2
      className={cn(
        "text-xs font-mono font-medium uppercase tracking-widest text-neutral-400 dark:text-neutral-500",
        className,
      )}
    >
      {children}
    </h2>
  );
}
