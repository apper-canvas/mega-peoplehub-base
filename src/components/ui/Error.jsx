import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message, onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await onRetry();
    setIsRetrying(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-error/10 rounded-full">
          <ApperIcon name="AlertCircle" className="w-8 h-8 text-error" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Oops! Something went wrong
        </h3>
        <p className="text-secondary">{message || "Unable to load data. Please try again."}</p>
        {onRetry && (
          <Button onClick={handleRetry} disabled={isRetrying}>
            {isRetrying ? "Retrying..." : "Try Again"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Error;