"use client";
import CustomGenericModal from "../ui/Generic/CustomGenericModal";
import CustomGenericForm, {
  FieldConfig,
} from "../ui/Generic/CustomGenericForm";
import { ProductPurchasesResponseI, ProductResponseI } from "@/types/product-interfaces";
import { convertNumberToBRL } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductBuyDataI, productBuySchema } from "@/schemas/product-schema";

import { initMercadoPago } from '@mercadopago/sdk-react';
import { useEffect, useState } from "react";
import { ProductPaymentModalForm } from "./ProductPaymentModalForm";

const ProductBuyModalForm: React.FC<{
  slug: string;
  product: ProductResponseI;
  open: boolean;
  setOpen: (open: boolean) => void;
  onProductPurchase: (newProduct: ProductPurchasesResponseI) => void;
}> = ({ slug, product, open, setOpen, onProductPurchase }) => {
  const [buyableProduct, setBuyableProduct] = useState<ProductBuyDataI | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_API_KEY_MERCADO!, {locale: "pt-BR"});
  }, [])

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
    setBuyableProduct(data);
    setIsLoadingPayment(true);
  };

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


  const onPaymentFormIsReady = () => {
    setIsLoadingPayment(false);
   };

  return (
    <CustomGenericModal
      title="Comprar"
      description="Forneça as informações necessárias para comprar o produto!"
      open={open}
      onOpenChange={(open) => {setOpen(open); setBuyableProduct(null);} }
      trigger={null}
    >
      <div className="flex flex-col gap-4">
        <div className="text-lg font-semibold text-gray-700">
          Preço Total: {convertNumberToBRL(totalPrice)}
        </div>
        {buyableProduct ? (
          <ProductPaymentModalForm
            buyableProduct={buyableProduct}
            product={product}
            onReady={(onPaymentFormIsReady)}
            slug={slug}
            open={open}
            onOpenChange={setOpen}
            price={totalPrice}
            onProductPurchase={onProductPurchase}
            onBuyableChange={setBuyableProduct}
          />
        ) : (
          <CustomGenericForm<ProductBuyDataI>
            schema={productBuySchema}
            fields={fields}
            defaultValues={form.getValues()}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            form={form}
            submitLabel="Realizar Pedido"
          />
        ) }
      </div>
    </CustomGenericModal>
  );
};

export default ProductBuyModalForm;
