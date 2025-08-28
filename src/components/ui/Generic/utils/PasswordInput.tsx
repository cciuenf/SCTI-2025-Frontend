import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function PasswordInput({
  field,
  disabled,
  placeholder,
}: {
  field: { value: string; onChange: (value: string) => void };
  disabled: boolean;
  placeholder?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        value={field.value}
        onChange={(e) => field.onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
      />
      <div
        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5 text-accent" />
        ) : (
          <Eye className="h-5 w-5 text-accent" />
        )}
      </div>
    </div>
  );
}