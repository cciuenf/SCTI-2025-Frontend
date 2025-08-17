"use client";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import CustomGenericForm, {
  FieldConfig,
} from "../ui/Generic/CustomGenericForm";
import type { 
  ProductPurchasesResponseI, 
  ProductResponseI 
} from "@/types/product-interfaces";
import { convertNumberToBRL } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ProductBuyDataI, productBuySchema } from "@/schemas/product-schema";

import { useState } from "react";
import { ProductPaymentModalForm } from "./ProductPaymentModalForm";
import type { IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";

const ProductBuyModalForm: React.FC<{
  slug: string;
  product: ProductResponseI;
  open: boolean;
  setOpen: (open: boolean) => void;
  handlePaymentSelector: (
    pay: IPaymentFormData, 
    buyableProduct: ProductBuyDataI
  ) => Promise<{state: boolean, data: ProductPurchasesResponseI | null, id: string | null }>;
}> = ({ slug, product, open, setOpen, handlePaymentSelector }) => {
  const [buyableProduct, setBuyableProduct] = useState<ProductBuyDataI | null>(null);

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

  const handleSubmit = async (data: ProductBuyDataI) => setBuyableProduct(data);

  // const handleSubmit = async (data: ProductBuyDataI) => {
  //   const result = await handleBuyProduct(
  //     { ...data, product_id: product.ID },
  //     slug
  //   );
  //   if (result?.success && result.data && onProductPurchase) {
  //     toast.success(`Produto comprado com sucesso!`);
  //     setOpen(false);
  //     onProductPurchase(result.data.purchase);
  //     return;
  //   }

  //   if (!result.success && result.message) {
  //     const errorReason = result.message.split(":");

  //     switch (errorReason[1].trim()) {
  //       case "user is not registered to this event":
  //         toast.error(
  //           "Você precisa se inscrever no evento antes de comprar um produto!"
  //         );
  //         break;
  //       default:
  //         toast.error("Erro desconhecido ao tentar comprar produto!");
  //     }
  //   }
  // };

  return (
    <CustomGenericModal
      title="Comprar"
      description="Forneça as informações necessárias para comprar o produto!"
      open={open}
      onOpenChange={(open) => {setOpen(open); setBuyableProduct(null);} }
      trigger={null}
    >
      {buyableProduct ? (
        <ProductPaymentModalForm
          buyableProduct={buyableProduct}
          product={product}
          slug={slug}
          open={open}
          onOpenChange={setOpen}
          price={totalPrice}
          onBuyableChange={setBuyableProduct}
          handlePaymentSelector={handlePaymentSelector}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="text-lg text-center font-semibold text-gray-700">
            Preço Total: {convertNumberToBRL(totalPrice)}
          </div>
          <CustomGenericForm<ProductBuyDataI>
            schema={productBuySchema}
            fields={fields}
            defaultValues={form.getValues()}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            form={form}
            submitLabel="Realizar Pedido"
          />
        </div>
      ) 
      }
    </CustomGenericModal>
  );
};

export default ProductBuyModalForm;
