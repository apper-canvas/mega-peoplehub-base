import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ children, className, hover = false, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-100",
        hover && "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;