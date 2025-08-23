import { convertNumberToBRL } from "@/lib/utils";
import { Input } from "../../input";
import { MultiSelect } from "../../multi-select";
import { Switch } from "../../switch";
import { SimpleDateTimePicker } from "./SimpleDateTimePicker";
import type { SetStateAction } from "react";
import type { FieldType } from "../CustomGenericForm";
import type { ControllerRenderProps, FieldPath, FieldValues } from "react-hook-form";
import { Select } from "../../select";
import { PasswordInput } from "./PasswordInput";
import { Checkbox } from "../../checkbox";

type CommonProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, FieldPath<T>>;
  disabled: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  showPassword?: boolean;
  setShowPassword?: React.Dispatch<SetStateAction<boolean>>;
};

type Renderer = <T extends FieldValues>(props: CommonProps<T>) => React.ReactNode;

export const FormInputRenderMap = {
  text: ({ field, disabled, placeholder }) => (
    <Input {...field} placeholder={placeholder} disabled={disabled} />
  ),
  email: ({ field, disabled, placeholder }) => (
    <Input {...field} type="email" placeholder={placeholder} disabled={disabled} />
  ),
  number: ({ field, disabled, placeholder }) => (
    <Input
      type="number"
      min={0}
      value={isNaN(field.value) ? "" : field.value}
      onChange={(e) => !disabled && field.onChange(e.target.valueAsNumber)}
      placeholder={placeholder}
      disabled={disabled}
    />
  ),
  switch: ({ field, disabled }) => (
    <Switch
      checked={field.value}
      onCheckedChange={disabled ? undefined : field.onChange}
      disabled={disabled}
    />
  ),
  checkbox: ({ field, disabled }) => (
    <Checkbox
      checked={field.value}
      onCheckedChange={disabled ? undefined : field.onChange}
      disabled={disabled}
    />
  ),
  price: ({ field, disabled, placeholder }) => (
    <Input
      type="text"
      value={
        typeof field.value === "number" ? convertNumberToBRL(field.value) : ""
      }
      onChange={(e) => {
        if (disabled) return;
        const raw = e.target.value.replace(/[^\d]/g, "");
        field.onChange(parseInt(raw || "0", 10));
      }}
      maxLength={23}
      placeholder={placeholder}
      disabled={disabled}
    />
  ),
  select: ({ field, disabled, placeholder, options = [] }) => (
    <Select
      value={field.value as string}
      onValueChange={(value) => !disabled && field.onChange(value)}
      options={options}
      placeholder={placeholder}
      className="w-full"
      disabled={disabled}
    />
  ),
  multiple_select: ({ field, disabled, placeholder, options = [] }) => (
    <MultiSelect
      options={options}
      onValueChange={field.onChange}
      defaultValue={field.value || []}
      placeholder={placeholder}
      onChange={field.onChange}
      disabled={disabled}
    />
  ),
  datetime: ({ field, disabled, placeholder }) => (
    <SimpleDateTimePicker
      value={field.value}
      onChange={field.onChange}
      disabled={disabled}
      placeholder={placeholder}
    />
  ),
  password: ({ field, disabled, placeholder }) => (
    <PasswordInput field={field} placeholder={placeholder} disabled={disabled} />
  )
} satisfies Record<FieldType, Renderer>;
