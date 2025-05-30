"use client";
import React, { useState } from "react";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import CustomGenericForm, {FieldConfig} from "../ui/Generic/CustomGenericForm";
import { z } from "zod";
import { ProductResponseI } from "@/types/product-interfaces";
import { handleBuyProduct } from "@/actions/product-actions";

const productSchema = z.discriminatedUnion("is_gift", [
  z.object({
    is_gift: z.literal(true),
    gifted_to_email: z.string().email({ message: "E-mail inválido" }),
    quantity: z.number({
      invalid_type_error: "Você precisa inserir um número",
      required_error: "Campo obrigatório",
    }).int().min(1, "Quantidade inválida"),
  }),
  z.object({
    is_gift: z.literal(false),
    gifted_to_email: z.string(),
    quantity: z.number({
      invalid_type_error: "Você precisa inserir um número",
      required_error: "Campo obrigatório",
    }).int().min(1, "Quantidade inválida"),
  })
]);

type ProductDataI = z.infer<typeof productSchema>;

const ProductBuyModalForm: React.FC<{ slug: string, product: ProductResponseI }> = ({ slug, product }) => {
  const [open, setOpen] = useState(false);

  const fields: FieldConfig<ProductDataI>[] = [
    { name: "is_gift", label: "É um presente?", type: "switch" as const },
    { 
      name: "gifted_to_email", 
      label: "E-mail do alvo", 
      placeholder: "teste@gmail.com", 
      type: "text" as const,
      disabledWhen: {
        field: "is_gift",
        value: false
      }
    },
    { name: "quantity", label: "Quantidade", type: "number" as const, placeholder: "0" },
  ];

  const handleSubmit = async (data: ProductDataI) => {
    try {
      const result = await handleBuyProduct({...data, product_id: product.ID}, slug);
      if (result?.success) setOpen(false);
    } catch (error) {
      console.error("Erro ao criar produto:", error);
    }
  };

  return (
    <CustomGenericModal
      title="Comprar"
      description="Forneça as informações necessárias para comprar o produto!"
      open={open}
      onOpenChange={setOpen}
    >
      <CustomGenericForm<ProductDataI> 
        schema={productSchema} 
        fields={fields} 
        defaultValues={{
          is_gift: false,
          gifted_to_email: "",
          quantity: 1,
        }}
        onSubmit={handleSubmit}
        onCancel={() => setOpen(false)}
      />
    </CustomGenericModal>
  );
};

export default ProductBuyModalForm;
