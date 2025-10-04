import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ label, error, helperText, ...inputProps }) => {
  return (
    <div className="space-y-1">
      {label && <Label>{label}</Label>}
      <Input error={error} {...inputProps} />
      {error && <p className="text-sm text-error">{error}</p>}
      {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

export default FormField;