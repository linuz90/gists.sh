"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

const Provider = TooltipPrimitive.Provider;
const Root = TooltipPrimitive.Root;
const Trigger = TooltipPrimitive.Trigger;

const Content = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={`z-50 rounded-md bg-neutral-800 px-2.5 py-1.5 text-xs text-neutral-100 dark:bg-neutral-700 animate-in fade-in-0 zoom-in-95 ${className ?? ""}`}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
Content.displayName = "TooltipContent";

export { Provider, Root, Trigger, Content };
