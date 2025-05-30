import { convertNumberToBRL } from "@/lib/utils"
import { Input } from "../../input"
import { MultiSelect } from "../../multi-select"
import { Switch } from "../../switch"

export const FormInputRenderMap: Record<string, (props: {
  field: any
  disabled: boolean
  placeholder?: string
  options?: { label: string; value: string }[]
}) => React.ReactNode> = {
  text: ({ field, disabled, placeholder }) => (
    <Input {...field} placeholder={placeholder} disabled={disabled} />
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
  price: ({ field, disabled, placeholder }) => (
    <Input
      type="text"
      value={ typeof field.value === "number" ? convertNumberToBRL(field.value) : "" }
      onChange={(e) => {
        if (disabled) return;
        const raw = e.target.value.replace(/[^\d]/g, "")
        field.onChange(parseInt(raw || "0", 10))
      }}
      maxLength={23}
      placeholder={placeholder}
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
}
