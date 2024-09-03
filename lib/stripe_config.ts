export const CURRENCY = "usd";
// Set your amount limits: Use float for decimal currencies and
// Integer for zero-decimal currencies: https://stripe.com/docs/currencies#zero-decimal.
export const MIN_AMOUNT = 10.0;
export const MAX_AMOUNT = 5000.0;
export const AMOUNT_STEP = 5.0;

export interface Product {
  name: string;
  description: string;
  price: string;
  stripePrice: number;
  stripePriceId: string;
  duration: number;
  recurring: boolean;
}

export type Products = Product[];

export const products: Products = [
  {
    name: "Monthly - Sub",
    description: "Premium!",
    price: "$7/month",
    stripePrice: 700,
    recurring: true,
    duration: 30,
    stripePriceId: "price_1N3S99LFY6IEm8cQIUVlcQuZ",
  } as Product,
  {
    name: "Month - Single Payment",
    description: "Premium!",
    price: "$9",
    stripePrice: 900,
    recurring: false,
    duration: 30,
    stripePriceId: "price_1Puof7LFY6IEm8cQqqiFJgTH",
  } as Product,
  {
    name: "Yearly - Sub",
    description: "Premium!",
    price: "$70/year",
    stripePrice: 7000,
    recurring: true,
    duration: 365,
    stripePriceId: "price_1PuogyLFY6IEm8cQxLNwjRQj",
  } as Product,
  {
    name: "Yearly - Single Payment",
    description: "Premium!",
    price: "$90",
    stripePrice: 9000,
    recurring: false,
    duration: 365,
    stripePriceId: "price_1PuohDLFY6IEm8cQoQDZa79q",
  } as Product,
];
