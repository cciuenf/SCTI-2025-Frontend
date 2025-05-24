"use client";
import React, { useState } from "react";
import CustomGenericModal from "./ui/Generic/CustomGenericModal";
import CustomGenericForm, {FieldConfig} from "./ui/Generic/CustomGenericForm";
import { z } from "zod";
import { ProductCredentialsWithSlugI } from "@/types/product-interfaces";

const productSchema = z.object({
  slug_to_query: z.string().min(3, "Slug deve ter pelo menos 3 caracteres"),
  name: z.string().min(2, "Nome precisa de pelo menos 2 caracteres"),
  description: z.string().min(10, "Descrição precisa de pelo menos 10 caracteres"),
  price_int: z.number({
    invalid_type_error: "Você precisa inserir um número",
    required_error: "Campo obrigatório",
  }).int().min(0, "O preço precisa ser positivo"),
  has_unlimited_quantity: z.boolean(),
  quantity: z.number({
    invalid_type_error: "Você precisa inserir um número",
    required_error: "Campo obrigatório",
  }).int().min(0, "Quantidade inválida"),

  // start_date: z.date(),
  // end_date: z.date(),
  // slug: z.string().min(3, "Slug deve ter pelo menos 3 caracteres"),


  // event_id: string;
  // is_activity_access: boolean,
  // is_activity_token: boolean,
  // is_blocked: boolean,
  // is_event_access: boolean,
  // is_hidden: boolean,
  // is_physical_item: boolean,
  // is_public: boolean,
  // is_ticket_type: boolean,
  // max_ownable_quantity: number,
  // token_quantity: number
});

type ProductData = z.infer<typeof productSchema>;

const ProductModalForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const fields: FieldConfig<ProductCredentialsWithSlugI>[] = [
    { name: "slug_to_query", label: "Slug", placeholder: "Computação" },
    { name: "name", label: "Nome", placeholder: "Nome do Produto" },
    { name: "description", label: "Descrição", placeholder: "Coloque a descrição do produto" },
    { name: "price_int", label: "Preço do Produto", type: "price" as const, placeholder: "R$ 0,00" },
    { name: "has_unlimited_quantity", label: "É infinito?", type: "switch" as const },
    { name: "quantity", label: "Quantidade", type: "number" as const, placeholder: "0" },
  ];

  const handleSubmit = async (data: ProductData) => {
    console.log("Dados enviados:", data);
    setOpen(false);
  };

  return (
    <CustomGenericModal
      title="Crie seu Produto"
      description="Preencha todos os campos abaixo para que consiga criar o produto desejado!"
      open={open}
      onOpenChange={setOpen}
    >
      <CustomGenericForm<ProductData> 
        schema={productSchema} 
        fields={fields} 
        defaultValues={{name: "", description: "", has_unlimited_quantity: false, price_int: 0, quantity: 0, slug_to_query: ""}}
        onSubmit={handleSubmit}
        onCancel={() => setOpen(false)}
      />
    </CustomGenericModal>
  );
};

export default ProductModalForm;
