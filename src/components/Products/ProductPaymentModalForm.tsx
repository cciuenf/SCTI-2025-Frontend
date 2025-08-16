"use client";
import type { IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";
import { Payment, StatusScreen } from "@mercadopago/sdk-react";
import type { ProductBuyDataI } from "@/schemas/product-schema";
import { toast } from "sonner";
import type { ProductPurchasesResponseI, ProductResponseI } from "@/types/product-interfaces";
import { customization } from "@/lib/paymentCustomization";
import { useState } from "react";

interface Props {
  product: ProductResponseI;
  slug: string;  
  price: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  buyableProduct: ProductBuyDataI,
  onBuyableChange: (product: ProductBuyDataI | null) => void,
  handlePaymentSelector: (
    pay: IPaymentFormData, 
    buyableProduct: ProductBuyDataI
  ) => Promise<{state: boolean, data: ProductPurchasesResponseI | null, id?: string | null }>;
}

export const ProductPaymentModalForm = (props: Props)  => {
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const onError = async (error: any) => {
    try {
      console.error(error);
    } catch (error: any) {
      console.error(error);
      toast.error(error);
    }
  };
  const handleSubmit = async (pay: IPaymentFormData) => {
    setPaymentId(null);
    const result = await props.handlePaymentSelector(pay, props.buyableProduct);
    if(result.id) setPaymentId(result.id);
    else {
      props.onOpenChange(false);
      props.onBuyableChange(null);
    }
  }

  const initializationPayment = { amount: props.price / 100 };
   
  return (
    (paymentId ?     
      <StatusScreen
        initialization={{paymentId: paymentId}}
        locale="pt-BR"
        onError={onError}
      /> 
    :
      <Payment
        initialization={initializationPayment}
        customization={customization}
        onSubmit={handleSubmit}
        onError={onError}
      />
    )
  )
}