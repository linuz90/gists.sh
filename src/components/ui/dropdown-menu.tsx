"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";

const Root = DropdownMenuPrimitive.Root;
const Trigger = DropdownMenuPrimitive.Trigger;
const Portal = DropdownMenuPrimitive.Portal;

const Content = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={`z-50 min-w-[160px] rounded-xl! bg-neutral-900 dark:bg-neutral-200 p-1 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 ${className ?? ""}`}
      {...props}
    />
  </Portal>
));
Content.displayName = "DropdownMenu.Content";

const Item = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={`flex items-center gap-2.5 px-2.5 py-1.5 text-[0.8125rem] rounded-lg! outline-none cursor-default select-none text-neutral-200 dark:text-neutral-700 data-[highlighted]:bg-white/10 dark:data-[highlighted]:bg-black/10 data-[highlighted]:text-white dark:data-[highlighted]:text-neutral-900 ${className ?? ""}`}
    {...props}
  />
));
Item.displayName = "DropdownMenu.Item";

const Separator = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={`h-px my-1 mx-1.5 bg-white/10 dark:bg-black/10 ${className ?? ""}`}
    {...props}
  />
));
Separator.displayName = "DropdownMenu.Separator";

export const DropdownMenu = {
  Root,
  Trigger,
  Content,
  Item,
  Separator,
};
