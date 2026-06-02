import PremiumInvoice from "./PremiumInvoice";

export { PremiumInvoice };

export const variants = [
  {
    variant: "premium",
    slug: "premium-invoice-premium",
    Component: PremiumInvoice,
    componentName: "PremiumInvoice",
  },
];

export default { PremiumInvoice };
