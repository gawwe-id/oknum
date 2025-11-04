import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonPrimaryVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-emerald-600 focus-visible:ring-emerald-600/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        solid:
          "bg-emerald-600 text-white shadow-xs hover:bg-emerald-500 active:bg-emerald-700",
        outline:
          "border border-emerald-600 bg-white text-emerald-600 shadow-xs hover:bg-emerald-50 hover:border-emerald-700 active:bg-emerald-100",
        ghost:
          "text-emerald-600 hover:bg-emerald-50 active:bg-emerald-100",
        link: "text-emerald-600 underline-offset-4 hover:underline hover:text-emerald-700",
      },
      size: {
        xs: "h-7 rounded-md gap-1 px-2.5 text-xs has-[>svg]:px-2",
        sm: "h-8 rounded-md gap-1.5 px-3 text-sm has-[>svg]:px-2.5",
        md: "h-9 px-4 py-2 text-sm has-[>svg]:px-3",
        lg: "h-10 rounded-md px-6 text-base has-[>svg]:px-4",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  }
);

function ButtonPrimary({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonPrimaryVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button-primary"
      className={cn(buttonPrimaryVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { ButtonPrimary, buttonPrimaryVariants };

