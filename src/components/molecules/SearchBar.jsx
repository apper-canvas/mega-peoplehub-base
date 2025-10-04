import { forwardRef } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SearchBar = forwardRef(({ className, placeholder = "Search...", ...props }, ref) => {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <ApperIcon name="Search" className="w-5 h-5 text-gray-400" />
      </div>
      <input
        ref={ref}
        type="text"
        className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;