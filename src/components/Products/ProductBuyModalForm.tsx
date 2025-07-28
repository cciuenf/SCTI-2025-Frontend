"use client";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import CustomGenericForm, {
  FieldConfig,
} from "../ui/Generic/CustomGenericForm";
import { ProductPurchasesResponseI, ProductResponseI } from "@/types/product-interfaces";
import { handleBuyProduct } from "@/actions/product-actions";
import { convertNumberToBRL } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductBuyDataI, productBuySchema } from "@/schemas/product-schema";
import { toast } from "sonner";

const ProductBuyModalForm: React.FC<{
  slug: string;
  product: ProductResponseI;
  open: boolean;
  setOpen: (open: boolean) => void;
  onProductPurchase: (newProduct: ProductPurchasesResponseI) => void,
}> = ({ slug, product, open, setOpen, onProductPurchase }) => {

  const form = useForm<ProductBuyDataI>({
    resolver: zodResolver(productBuySchema),
    defaultValues: {
      is_gift: false,
      gifted_to_email: "",
      quantity: 1,
    },
  });

  const quantity = form.watch("quantity");
  const totalPrice = isNaN(quantity) ? 0 : product.price_int * quantity;

  const fields: FieldConfig<ProductBuyDataI>[] = [
    { name: "is_gift", label: "É um presente?", type: "switch" as const },
    {
      name: "gifted_to_email",
      label: "E-mail do alvo",
      placeholder: "teste@gmail.com",
      type: "text" as const,
      disabledWhen: {
        field: "is_gift",
        value: false,
      },
    },
    {
      name: "quantity",
      label: "Quantidade",
      type: "number" as const,
      placeholder: "0",
    },
  ];

  const handleSubmit = async (data: ProductBuyDataI) => {
    try {
      const result = await handleBuyProduct(
        { ...data, product_id: product.ID },
        slug
      );
      if (result?.success && result.data && onProductPurchase) {
        toast.success(`Produto comprado com sucesso!`);
        setOpen(false);
        onProductPurchase(result.data.purchase)
        return;
      }
    } catch (error) {
      toast.error(`Erro ao criar produto: ${product.name}`);
      console.error("Erro ao criar produto:", error);
    }
    toast.error("Erro ao comprar o produto!");
  };

  return (
    <CustomGenericModal
      title="Comprar"
      description="Forneça as informações necessárias para comprar o produto!"
      open={open}
      onOpenChange={setOpen}
      trigger={null}
    >
      <div className="flex flex-col gap-4">
        <div className="text-lg font-semibold text-gray-700">
          Preço Total: {convertNumberToBRL(totalPrice)}
        </div>
        <CustomGenericForm<ProductBuyDataI>
          schema={productBuySchema}
          fields={fields}
          defaultValues={form.getValues()}
          onSubmit={handleSubmit}
          onCancel={() => setOpen(false)}
          form={form}
        />
      </div>
    </CustomGenericModal>
  );
};

export default ProductBuyModalForm;
