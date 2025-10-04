import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(
  ({ children, className, variant = "primary", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2";
    
    const variants = {
      primary: "bg-primary hover:bg-primary-dark text-white shadow-sm hover:shadow-md active:scale-[0.98]",
      secondary: "bg-white hover:bg-gray-50 text-secondary border border-gray-300 shadow-sm hover:shadow-md active:scale-[0.98]",
      ghost: "text-secondary hover:bg-gray-100 active:scale-[0.98]",
      danger: "bg-error hover:bg-red-600 text-white shadow-sm hover:shadow-md active:scale-[0.98]"
    };
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm min-h-[36px]",
      md: "px-4 py-2 text-sm min-h-[44px]",
      lg: "px-6 py-3 text-base min-h-[48px]"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;