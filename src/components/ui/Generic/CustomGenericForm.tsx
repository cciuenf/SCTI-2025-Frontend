"use client";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import type { 
  SubmitHandler, 
  UseFormReturn, 
  DefaultValues, 
  FieldValues, 
  FieldPath, 
  FieldPathValue 
} from "react-hook-form";
import type { ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInputRenderMap } from "./utils/FormInputsMap";

type BooleanFieldPath<T extends FieldValues> = {
  [K in FieldPath<T>]: FieldPathValue<T, K> extends boolean ? K : never
}[FieldPath<T>];

export type FieldType = | "text" | "number" | "price" | "switch" 
  | "select" | "multiple_select" | "datetime" | "password" | "email";

export interface FieldConfig<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: FieldType
  options?: { label: string; value: string }[];
  disabledWhen?: {
    field: BooleanFieldPath<T>;
    value: boolean;
  };
}

interface GenericFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  fields: FieldConfig<T>[];
  onSubmit: SubmitHandler<T>;
  onCancel?: () => void;
  submitLabel?: string;
  submittingLabel?: string;
  cancelLabel?: string;
  defaultValues?: DefaultValues<T>;
  form?: UseFormReturn<T>;
}

function CustomGenericForm<T extends FieldValues>({
  schema,
  fields,
  onSubmit,
  onCancel,
  submitLabel = "Enviar",
  submittingLabel = "Enviando",
  cancelLabel = "Cancelar",
  defaultValues,
  form: externalForm,
}: GenericFormProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const internalForm = useForm<T>({
    resolver: zodResolver(schema),
    ...(defaultValues ? { defaultValues } : {}),
  });
  const form = externalForm || internalForm;

  const handle = async (data: T) => {
    setIsLoading(true);
    await onSubmit(data);
    setIsLoading(false);
  };

  const isFieldDisabled = (field: FieldConfig<T>) => {
    if (!field.disabledWhen) return false;
    const { field: dependentField, value } = field.disabledWhen;
    const watchedValue = form.watch(dependentField);
    return watchedValue === value;
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handle)}
        className="flex flex-col gap-4 items-center"
      >
        {fields.map((f) => (
          <FormField
            key={String(f.name)}
            control={form.control}
            name={f.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{f.label}</FormLabel>
                <FormControl>
                  {FormInputRenderMap[f.type || "text"]({
                    field,
                    disabled: isFieldDisabled(f),
                    placeholder: f.placeholder,
                    options: f.options,
                  })}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className={`grid gap-4 mt-4 w-full grid-cols-${onCancel ? 2 : 1}`}>
          {onCancel && (
            <Button
              type="button"
              className="min-w-28"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" variant="yellow" className="min-w-28" disabled={isLoading}>
            {isLoading ? submittingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CustomGenericForm;
