import type { IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";
import { Payment } from "@mercadopago/sdk-react";
import { handleBuyProduct } from "@/actions/product-actions";
import type { ProductBuyDataI } from "@/schemas/product-schema";
import { toast } from "sonner";
import type { ProductPurchasesResponseI, ProductResponseI } from "@/types/product-interfaces";
import { customization } from "@/lib/paymentCustomization";

interface Props {
  product: ProductResponseI;
  slug: string;  
  price: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReady: () => void;
  onProductPurchase: (newProduct: ProductPurchasesResponseI) => void,
  buyableProduct: ProductBuyDataI,
  onBuyableChange: (product: ProductBuyDataI | null) => void,
}

export const ProductPaymentModalForm = (props: Props)  => {
  const onError = async (error: any) => {
    console.error(error);
    toast.error(error);
  };
  const handleSubmit = async (data: IPaymentFormData) => {
    // console.log(data);
    try {
      const result = await handleBuyProduct(
        {
           ...props.buyableProduct, 
          product_id: props.product.ID,
          payment_method_id: data.formData.payment_method_id,
          payment_method_installments: data.formData.installments,
          payment_method_token: data.formData.token,
          payment_method_type: data.paymentType
        },
        props.slug
      );
      if (result?.success && result.data) {
        toast.success(`Produto comprado com sucesso!`);
        props.onOpenChange(false);
        props.onProductPurchase(result.data.purchase);
        props.onBuyableChange(null);
        return;
      }
    } catch (error) {
      toast.error(`Erro ao criar produto: ${props.product.name}`);
      console.error("Erro ao criar produto:", error);
    }
    toast.error("Erro ao comprar o produto!");
  }

  const initialization = {
    amount: props.price / 100,
   };


  return (
    <Payment
      initialization={initialization}
      customization={customization}
      onSubmit={handleSubmit}
      onReady={props.onReady}
      onError={onError}
    />
  )
}