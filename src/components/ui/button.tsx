"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = {
    default: "bg-[#2d5016] text-white hover:bg-[#234012] shadow-[0_4px_12px_rgba(45,80,22,0.2)] hover:shadow-[0_6px_16px_rgba(45,80,22,0.3)] hover:-translate-y-[2px]",
    secondary: "bg-transparent border-2 border-[#2d5016] text-[#2d5016] hover:bg-[#9caf88] hover:text-[#1f2937]",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-[#2d5016] underline-offset-4 hover:underline",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    cta: "bg-[#e07a5f] text-white font-bold rounded-full shadow-[0_6px_20px_rgba(224,122,95,0.3)] hover:shadow-[0_8px_25px_rgba(224,122,95,0.4)] hover:scale-105",
};

const buttonSizes = {
    default: "h-12 px-8 py-3.5 text-base",
    sm: "h-9 rounded-md px-3",
    lg: "h-14 rounded-md px-8 text-lg",
    icon: "h-10 w-10",
    pill: "h-12 px-8 rounded-full",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof buttonVariants;
    size?: keyof typeof buttonSizes;
    asChild?: boolean;
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", asChild = false, isLoading, children, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        // If it's a Slot, we don't want to wrap it in motion.button directly as Slot merges props.
        // However, we want animations. For simplicity in this specific design system fix:
        // If asChild is true, we skip framer-motion specific props to avoid collision, 
        // OR we can just use a standard button for the design system.
        // Given the error was about 'asChild' missing, let's prioritize standard functionality first.

        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    buttonVariants[variant],
                    buttonSizes[size],
                    className
                )}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {asChild ? (
                    children
                ) : (
                    <>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {children}
                    </>
                )}
            </Comp>
        );
    }
);
Button.displayName = "Button";

export { Button };
