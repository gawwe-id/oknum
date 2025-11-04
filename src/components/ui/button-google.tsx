import * as React from "react";
import { Loader2 } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonGoogleVariants = cva(
  "cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-gray-400 focus-visible:ring-gray-400/50 focus-visible:ring-[3px] border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100",
  {
    variants: {
      size: {
        xs: "h-7 rounded-md gap-1.5 px-3 text-xs",
        sm: "h-8 rounded-md gap-2 px-3 text-sm",
        md: "h-9 px-4 py-2 text-sm gap-2",
        lg: "h-10 rounded-md px-6 text-base gap-2.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const GoogleIcon = ({ className }: { className?: string }) => (
  <img
    src="/google.svg"
    alt="Google"
    className={cn("shrink-0", className)}
    aria-hidden="true"
  />
);

interface ButtonGoogleProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonGoogleVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
}

function ButtonGoogle({
  className,
  size,
  asChild = false,
  isLoading = false,
  children,
  ...props
}: ButtonGoogleProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button-google"
      className={cn(buttonGoogleVariants({ size }), className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="size-4 animate-spin shrink-0" />
          <span>Memuat...</span>
        </>
      ) : (
        <>
          <GoogleIcon className="size-4" />
          {children || "Lanjutkan dengan Google"}
        </>
      )}
    </Comp>
  );
}

export { ButtonGoogle, buttonGoogleVariants, GoogleIcon };
