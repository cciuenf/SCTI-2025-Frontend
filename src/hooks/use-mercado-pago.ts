import { useEffect } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";
import type { IPaymentFormData } from "@mercadopago/sdk-react/esm/bricks/payment/type";
import { handleBuyProduct, handleBuyProductPix } from "@/actions/product-actions";
import type { ProductResponseI } from "@/types/product-interfaces";
import type { ProductBuyDataI } from "@/schemas/product-schema";
import { runWithToast } from "@/lib/client/run-with-toast";

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
    if(product === undefined) return { data: null, id: null };
    if(pay.paymentType === "bank_transfer") 
      return await performMercadoPagoPix(slug, product, buyableProduct);
    return await performMercadoPagoTransaction(pay, slug, product, buyableProduct);
  }

  async function performMercadoPagoPix(
    slug: string,
    product: ProductResponseI,
    buyableProduct: ProductBuyDataI
  ) {
    const res = await runWithToast(
      handleBuyProductPix(
        {
          ...buyableProduct, 
          product_id: product.ID,
        },
        slug
      ),
      {
        loading: 'Processando a compra...',
        success: () => "QR Code gerado com sucesso!",
        error: () => "Erro ao tentar gerar o produto",
      }
    );
    return { data: res.data, id: res.data?.id || null };
  }

  async function performMercadoPagoTransaction(
    pay: IPaymentFormData, 
    slug: string,
    product: ProductResponseI,
    buyableProduct: ProductBuyDataI
  ) {
    const res = await runWithToast(
      handleBuyProduct(
        {
          ...buyableProduct, 
          product_id: product.ID,
          payment_method_id: pay.formData.payment_method_id,
          payment_method_installments: pay.formData.installments,
          payment_method_token: pay.formData.token,
          payment_method_type: pay.paymentType
        },
        slug
      ),
      {
        loading: 'Processando a compra...',
        success: () => "Produto comprado com sucesso!",
        error: () => "Erro ao tentar comprar o produto",
      }
    );
    return { data: res.data?.purchase || null, id: null };
  }

  return { selectPaymentMethod };
};

export default useMercadoPago;