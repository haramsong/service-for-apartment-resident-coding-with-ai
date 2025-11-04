import { Input } from "./input";

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  className?: string;
}

export function FormField({
  id,
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
  autoFocus = false,
  autoComplete,
  className = "",
}: FormFieldProps) {
  return (
    <div>
      <label
        className="text-sm font-medium text-gray-700 mb-1 block"
        htmlFor={id}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        className={`${error ? "border-red-500" : ""} ${className}`}
      />
      {error && (
        <p className="text-xs text-red-600 mt-1 flex items-center">
          <span className="mr-1">✗</span> {error}
        </p>
      )}
    </div>
  );
}
