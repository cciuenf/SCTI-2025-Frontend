"use client";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import CustomGenericForm, {FieldConfig} from "../ui/Generic/CustomGenericForm";
import { handleCreateProduct, handleUpdateProduct } from "@/actions/product-actions";
import { ProductResponseI } from "@/types/product-interfaces";
import { ActivityResponseI } from "@/types/activity-interface";
import { ProductCreationDataI, productCreationSchema } from "@/schemas/product-schema";
import { toast } from "sonner";

const ProductModalForm: React.FC<{
  currentEvent: { id: string; slug: string }
  isCreating: boolean,
  product?: ProductResponseI,
  activities: ActivityResponseI[],
  onProductUpdate?: (updatedProduct: ProductResponseI) => void,
  onProductCreate?: (newProduct: ProductResponseI) => void,
  open: boolean,
  setOpen: (open: boolean) => void,
}> = ({ isCreating, currentEvent, product, activities, onProductUpdate, onProductCreate, open, setOpen }) => {

  const options = activities.map(activity => ({
    label: activity.name,
    unique: false,
    value: JSON.stringify({ is_event: false, target_id: activity.ID })
  }));

  options.unshift({
    label: currentEvent.slug,
    unique: true,
    value: JSON.stringify({ is_event: true, target_id: currentEvent.id })
  });

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
    { name: "token_quantity", label: "Quantidade de Tokens", type: "number" as const, placeholder: "0" },
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
      const parsedAccessTargets = data.access_targets.map(item => JSON.parse(item));
      const is_event_access = parsedAccessTargets.some(target => target.is_event);
      const is_activity_access = parsedAccessTargets.some(target => !target.is_event);
      const is_activity_token = data.token_quantity > 0;
      const transformedData = {
        ...data,
        access_targets: parsedAccessTargets.map(target => ({
          ...target,
          product_id: product?.ID
        })),
        is_event_access,
        is_activity_access,
        is_activity_token
      };
      if(isCreating) {
        const result = await handleCreateProduct(transformedData, currentEvent.slug);
        if (result?.success && result.data && onProductCreate) {
          setOpen(false);
          onProductCreate(result.data);
          toast.success("Produto criado!")
        }
      } else if(product) {
        const result = await handleUpdateProduct(transformedData, currentEvent.slug, product.ID);
        if (result?.success && result.data && onProductUpdate) {
          setOpen(false);
          onProductUpdate(result.data);
          toast.success("Produto atualizado!")
        }
      } else toast.error("Produto Inválido")
    } catch (error) {
      console.error("Erro ao manipular o produto:", error);
      toast.error(`Erro ao manipular o Produto: ${data.name}`);
    }
  };

  return (
    <CustomGenericModal
      title={isCreating ? "Crie seu Produto" : "Altere seu Produto"}
      description={`Preencha os campos abaixo para que consiga ${isCreating ? "criar" : "alterar"} o produto desejado!`}
      open={open}
      onOpenChange={setOpen}
      trigger={null}
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
          token_quantity: 0,
          is_physical_item: false,
          is_public: false,
          is_blocked: false,
          is_hidden: false,
          is_ticket_type: false,
          access_targets: [],
          expires_at: new Date(),
        }}
        onSubmit={handleSubmit}
        onCancel={() => setOpen(false)}
      />
    </CustomGenericModal>
  );
};

export default ProductModalForm;
