import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full px-4 py-2.5 text-sm text-gray-900 bg-white border rounded-md transition-colors duration-200",
          "placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
          "disabled:bg-gray-50 disabled:cursor-not-allowed",
          error ? "border-error focus:ring-error focus:border-error" : "border-gray-300",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;