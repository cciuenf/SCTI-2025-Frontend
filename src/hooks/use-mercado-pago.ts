import { useEffect } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import type { IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";
import { handleBuyProduct } from "@/actions/product-actions";
import { toast } from "sonner";
import type { ProductResponseI } from "@/types/product-interfaces";
import { ProductBuyDataI } from "@/schemas/product-schema";

const useMercadoPago = () => {

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_API_KEY_MERCADO!);
  }, []);

  async function selectPaymentMethod(
    pay: IPaymentFormData, 
    slug: string, 
    product: ProductResponseI | undefined,
    buyableProduct: ProductBuyDataI,
  ) {
    if(product === undefined) return { state: false, data: null };
    if(pay.paymentType === "bank_transfer")
      return await performMercadoPagoPix(pay, slug, product, buyableProduct);
    else return await performMercadoPagoTransaction(pay, slug, product, buyableProduct);
  }

  async function performMercadoPagoPix(
    pay: IPaymentFormData, 
    slug: string,
    product: ProductResponseI,
    buyableProduct: ProductBuyDataI
  ) {
    return { state: true, data: null, id: null };
  }

  async function performMercadoPagoTransaction(
    pay: IPaymentFormData, 
    slug: string,
    product: ProductResponseI,
    buyableProduct: ProductBuyDataI
  ) {
    try {
      const result = await handleBuyProduct(
        {
           ...buyableProduct, 
          product_id: product.ID,
          payment_method_id: pay.formData.payment_method_id,
          payment_method_installments: pay.formData.installments,
          payment_method_token: pay.formData.token,
          payment_method_type: pay.paymentType
        },
        slug
      );
      if (result?.success && result.data) {
        toast.success(`Produto comprado com sucesso!`);
        const url = result.data.purchase_resource.transactions.payments[0].payment_method.ticket_url;
        const subArray = url.split("/");
        const id = subArray[subArray.indexOf("payments") + 1];
        return { state: true, data: result.data.purchase, id };
      }
    } catch (error) {
      toast.error(`Erro ao comprar o produto: ${product.name}`);
      console.error("Erro ao comprar o produto:", error);
    }
    return { state: false, data: null, id: null };
  }

  return { selectPaymentMethod };
};

export default useMercadoPago;