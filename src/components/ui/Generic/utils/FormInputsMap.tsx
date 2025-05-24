import { Input } from "../../input"
import { Switch } from "../../switch"

export const FormInputRenderMap: Record<string, (props: {
  field: any
  disabled: boolean
  placeholder?: string
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
      value={
        typeof field.value === "number"
          ? (field.value / 100).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })
          : ""
      }
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
}
