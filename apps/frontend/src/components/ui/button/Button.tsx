import * as React from "react";

import { Slot } from "radix-ui";
import { buttonStyle } from "./ButtonStyle";
import { cn } from "@/lib/Utils";

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: keyof typeof buttonStyle.variants;
  size?: keyof typeof buttonStyle.sizes;
  asChild?: boolean;
}

function Button({
    className,
    variant = "default",
    size = "default",
    asChild = false,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot.Root : "button";

    return (
        <Comp
            data-slot="button"
            data-variant={variant}
            data-size={size}
            className={cn(
                buttonStyle.base,
                buttonStyle.variants[ variant ],
                buttonStyle.sizes[ size ],
                className
            )}
            {...props}
        />
    );
}

export { Button };
