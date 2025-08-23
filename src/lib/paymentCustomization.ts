import type { IPaymentBrickCustomization } from "@mercadopago/sdk-react/esm/bricks/payment/type";

export const customization: IPaymentBrickCustomization = {
  paymentMethods: {
    minInstallments: 1,
    maxInstallments: 12,
    bankTransfer: "all",
    creditCard: "all",
  },
};