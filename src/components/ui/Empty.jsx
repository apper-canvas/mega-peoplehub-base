import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ icon = "Inbox", title, message, action, onAction }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4 max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
          <ApperIcon name={icon} className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-secondary">{message}</p>
        {action && onAction && (
          <Button onClick={onAction}>{action}</Button>
        )}
      </div>
    </div>
  );
};

export default Empty;