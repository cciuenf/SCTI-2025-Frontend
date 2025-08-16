import type { IPaymentBrickCustomization } from "@mercadopago/sdk-react/esm/bricks/payment/type";

export const customization: IPaymentBrickCustomization = {
  paymentMethods: {
    minInstallments: 1,
    maxInstallments: 12,
    ticket: "all",
    bankTransfer: "all",
    creditCard: "all",
    prepaidCard: "all",
    debitCard: "all",
    mercadoPago: "all",
  },
};