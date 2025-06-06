"use client";
import React, { useState } from "react";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import CustomGenericForm, {FieldConfig} from "../ui/Generic/CustomGenericForm";
import { z } from "zod";
import { handleCreateProduct, handleUpdateProduct } from "@/actions/product-actions";
import { ProductResponseI } from "@/types/product-interfaces";

// Mock data for events and activities
const mockEvents = [
  { id: "event1", name: "SCTI 2025" },
];

const mockActivities = [
  { id: "activity1", name: "Palestra de IA", eventId: "event1" },
  { id: "activity2", name: "Workshop de React", eventId: "event1" },
  { id: "activity3", name: "Hackathon", eventId: "event2" },
];

const productSchema = z.object({
  name: z.string().min(2, "Nome precisa de pelo menos 2 caracteres"),
  description: z.string().min(10, "Descrição precisa de pelo menos 10 caracteres"),
  price_int: z.number({
    invalid_type_error: "Você precisa inserir um número",
    required_error: "Campo obrigatório",
  }).int().min(0, "O preço precisa ser positivo").max(999999999999999, "Preço muito alto"),
  has_unlimited_quantity: z.boolean(),
  quantity: z.number({
    invalid_type_error: "Você precisa inserir um número",
    required_error: "Campo obrigatório",
  }).int().min(0, "Quantidade inválida"),
  max_ownable_quantity: z.number({
    invalid_type_error: "Você precisa inserir um número",
    required_error: "Campo obrigatório",
  }).int().min(0, "Quantidade inválida"),
  is_physical_item: z.boolean(),
  is_public: z.boolean(),
  is_blocked: z.boolean(),
  is_hidden: z.boolean(),
  is_ticket_type: z.boolean(),
  access_targets: z.array(z.string())
    .transform((arr) => arr.map(item => JSON.parse(item)))
    .refine(
      (arr) => arr.every(item => 
        typeof item === 'object' && 
        'is_event' in item && 
        'target_id' in item &&
        typeof item.is_event === 'boolean' &&
        typeof item.target_id === 'string'
      ),
      {
        message: "Cada alvo de acesso deve ter is_event (boolean) e target_id (string)"
      }
    )
});

type ProductDataI = z.infer<typeof productSchema>;

const ProductModalForm: React.FC<{ 
  slug: string, 
  isCreating: boolean,
  product?: ProductResponseI,
  onProductUpdate?: (updatedProduct: ProductResponseI) => Promise<void>,
  onProductCreate?: (newProduct: ProductResponseI) => Promise<void>
}> = ({ slug, isCreating, product, onProductUpdate, onProductCreate }) => {
  const [open, setOpen] = useState(false);

  // Transform mock data into select options
  const eventOptions = mockEvents.map(event => ({
    label: event.name,
    unique: true,
    value: JSON.stringify({ is_event: true, target_id: event.id })
  }));

  const activityOptions = mockActivities.map(activity => ({
    label: activity.name,
    unique: false,
    value: JSON.stringify({ is_event: false, target_id: activity.id })
  }));

  const fields: FieldConfig<ProductDataI>[] = [
    { name: "name", label: "Nome", placeholder: "Nome do Produto" },
    { name: "description", label: "Descrição", placeholder: "Coloque a descrição do produto" },
    { name: "price_int", label: "Preço do Produto", type: "price" as const, placeholder: "R$ 0,00" },
    { name: "has_unlimited_quantity", label: "É infinito?", type: "switch" as const },
    { 
      name: "quantity", 
      label: "Quantidade", 
      type: "number" as const, 
      placeholder: "0",
      disabledWhen: {
        field: "has_unlimited_quantity",
        value: true
      }
    },
    { name: "max_ownable_quantity", label: "Quantidade máxima que pode ser adquirida", type: "number" as const, placeholder: "0" },
    { name: "is_physical_item", label: "É um item físico?", type: "switch" as const },
    { name: "is_public", label: "Público?", type: "switch" as const },
    { name: "is_blocked", label: "Está bloqueado?", type: "switch" as const },
    { name: "is_hidden", label: "Está oculto?", type: "switch" as const },
    { name: "is_ticket_type", label: "É um ticket?", type: "switch" as const },
    { 
      name: "access_targets", 
      label: "Libera Acesso a:", 
      type: "multiple_select" as const,
      options: [...eventOptions, ...activityOptions],
      placeholder: "Selecione o alvo do acesso"
    },
  ];

  const handleSubmit = async (data: ProductDataI) => {
    try {
      if(isCreating) {
        const result = await handleCreateProduct(data, slug);
        if (result?.success && result.data && onProductCreate) {
          setOpen(false);
          await onProductCreate(result.data);
        }
      } else if(product) {
        const result = await handleUpdateProduct(data, slug, product.ID);
        if (result?.success && result.data && onProductUpdate) {
          setOpen(false);
          await onProductUpdate(result.data);
        }
      } else throw new Error("Produto Inválido")
    } catch (error) {
      console.error("Erro ao criar produto:", error);
    }
  };

  return (
    <CustomGenericModal
      title={isCreating ? "Crie seu Produto" : "Altere seu Produto"}
      description={`Preencha os campos abaixo para que consiga ${isCreating ? "criar" : "alterar"} o produto desejado!`}
      open={open}
      onOpenChange={setOpen}
    >
      <CustomGenericForm<ProductDataI> 
        schema={productSchema} 
        fields={fields} 
        defaultValues={product || {
          name: "", 
          description: "", 
          price_int: 0, 
          has_unlimited_quantity: false, 
          quantity: 0,
          max_ownable_quantity: 1,
          is_physical_item: false,
          is_public: false,
          is_blocked: false,
          is_hidden: false,
          is_ticket_type: false,
          access_targets: []
        }}
        onSubmit={handleSubmit}
        onCancel={() => setOpen(false)}
      />
    </CustomGenericModal>
  );
};

export default ProductModalForm;
