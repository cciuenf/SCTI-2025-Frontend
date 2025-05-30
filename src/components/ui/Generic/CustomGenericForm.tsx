"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm, DefaultValues } from "react-hook-form";
import { ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInputRenderMap } from "./utils/FormInputsMap";

export interface FieldConfig<T> {
  name: keyof T;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "price" | "switch" | "select" | "multiple_select";
  options?: { label: string; value: string }[];
  disabledWhen?: {
    field: keyof T;
    value: boolean;
  };
}

interface GenericFormProps<T extends Record<string, any>> {
  schema: ZodSchema<T>;
  fields: FieldConfig<T>[];
  onSubmit: (data: T) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  defaultValues?: DefaultValues<T>;
  form?: ReturnType<typeof useForm<T>>;
}

function CustomGenericForm<T extends Record<string, any>>({
  schema,
  fields,
  onSubmit,
  onCancel,
  submitLabel = "Enviar",
  cancelLabel = "Cancelar",
  defaultValues,
  form: externalForm,
}: GenericFormProps<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const internalForm = useForm<T>({resolver: zodResolver(schema), ...(defaultValues ? { defaultValues } : {})});
  const form = externalForm || internalForm;

  const handle = async (data: T) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  const isFieldDisabled = (field: FieldConfig<T>) => {
    if (!field.disabledWhen) return false;
    const { field: dependentField, value } = field.disabledWhen;
    const watchedValue = form.watch(dependentField as any);
    return watchedValue === value;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handle)} className="flex flex-col gap-4 items-center">
        {fields.map((f) => (
          <FormField
            key={String(f.name)}
            control={form.control}
            name={f.name as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{f.label}</FormLabel>
                <FormControl>
                  {FormInputRenderMap[f.type || "text"]({
                    field,
                    disabled: isFieldDisabled(f),
                    placeholder: f.placeholder,
                    options: f.options
                  })}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <div className="flex justify-end gap-2 mt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" variant="yellow" disabled={isLoading}>
            {isLoading ? "Enviando..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default CustomGenericForm;