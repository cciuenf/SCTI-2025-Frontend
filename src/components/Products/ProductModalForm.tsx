"use client";
import React, { useState } from "react";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import CustomGenericForm, {FieldConfig} from "../ui/Generic/CustomGenericForm";
import { handleCreateProduct, handleUpdateProduct } from "@/actions/product-actions";
import { ProductResponseI } from "@/types/product-interfaces";
import { ActivityResponseI } from "@/types/activity-interface";
import { ProductCreationDataI, productCreationSchema } from "@/schemas/product-schema";

const ProductModalForm: React.FC<{ 
  slug: string, 
  isCreating: boolean,
  product?: ProductResponseI,
  activities: ActivityResponseI[],
  onProductUpdate?: (updatedProduct: ProductResponseI) => Promise<void>,
  onProductCreate?: (newProduct: ProductResponseI) => Promise<void>
}> = ({ slug, isCreating, product, activities, onProductUpdate, onProductCreate }) => {
  const [open, setOpen] = useState(false);

  const options = activities.map(activity => ({
    label: activity.name,
    unique: false,
    value: JSON.stringify({ is_event: false, target_id: activity.ID })
  }));

  // TODO: Change to use the event call by the slug name
  if(activities.length > 0) {
    options.unshift({
      label: slug, 
      unique: true, 
      value: JSON.stringify({ is_event: true, target_id: activities[0].event_id })
    })
  }

  const transformedProduct = product ? {
    ...product,
    access_targets: product.access_targets?.map(target => 
      JSON.stringify({ is_event: target.is_event, target_id: target.target_id })
    ) || []
  } : undefined;

  const fields: FieldConfig<ProductCreationDataI>[] = [
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
      name: "expires_at", 
      label: "Data de Expiração", 
      type: "datetime" as const,
      placeholder: "Selecione a data de expiração"
    },
    {
      name: "access_targets", 
      label: "Libera Acesso a:", 
      type: "multiple_select" as const,
      options: options,
      placeholder: "Selecione o alvo do acesso"
    },
  ];

  const handleSubmit = async (data: ProductCreationDataI) => {
    try {
      const transformedData = {
        ...data,
        access_targets: data.access_targets.map(item => JSON.parse(item))
      };

      if(isCreating) {
        const result = await handleCreateProduct(transformedData, slug);
        if (result?.success && result.data && onProductCreate) {
          setOpen(false);
          await onProductCreate(result.data);
        }
      } else if(product) {
        const result = await handleUpdateProduct(transformedData, slug, product.ID);
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
      <CustomGenericForm<ProductCreationDataI> 
        schema={productCreationSchema} 
        fields={fields} 
        defaultValues={transformedProduct || {
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
          access_targets: [],
          expires_at: "",
        }}
        onSubmit={handleSubmit}
        onCancel={() => setOpen(false)}
      />
    </CustomGenericModal>
  );
};

export default ProductModalForm;
