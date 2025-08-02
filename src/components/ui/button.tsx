"use client"

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "border-1 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[35px] text-sm font-normal transition-all disabled:pointer-events-none disabled:opacity-90 disabled:border-zinc-300 disabled:text-zinc-300 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive duration-300",
  {
    variants: {
      variant: {
        default:
          "text-secondary border-secondary hover:text-primary-foreground hover:bg-secondary",
        yellow:
          "text-accent border-accent hover:text-primary-foreground hover:bg-accent duration-300",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-secondary/70 border bg-background shadow-xs hover:text-secondary dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-primary-foreground dark:hover:bg-accent/50",
        sidebar: "text-accent hover:scale-115 border-0 bg-transparent",
        hour: "bg-accent border-background text-primary-foreground",
        profile: "bg-transparent rounded-[5px] py-1 px-2.5 border-secondary text-xl hover:tracking-wide",
        edit: "bg-secondary text-zinc-100 rounded-[5px] py-2 px-2.5 text-xl hover:tracking-wider"

      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
