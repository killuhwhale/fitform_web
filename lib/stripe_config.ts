export const CURRENCY = 'usd'
// Set your amount limits: Use float for decimal currencies and
// Integer for zero-decimal currencies: https://stripe.com/docs/currencies#zero-decimal.
export const MIN_AMOUNT = 10.0
export const MAX_AMOUNT = 5000.0
export const AMOUNT_STEP = 5.0



export interface Product {
    name: string;
    description: string;
    price: string;
    stripePrice: number;
    stripePriceId: string;
    duration: number;
    recurring: boolean,
}

export type Products = Product[]

export const products: Products = [
  {
      name: 'Monthly - Sub',
      description: 'Premium!',
      price: '$7/month',
      stripePrice: 700,
      recurring: true,
      duration: 30,
      stripePriceId: 'price_1N3S99LFY6IEm8cQIUVlcQuZ',
    } as Product,
  {
      name: 'Monthly - One Time',
      description: 'Premium!',
      price: '$12',
      stripePrice: 1200,
      recurring: false,
      duration: 30,
      stripePriceId: 'price_1N3S99LFY6IEm8cQexJ87g88',
    } as Product,
    {
      name: 'Yearly - Sub',
      description: 'Premium!',
      price: '$60/year',
      stripePrice: 6000,
      recurring: true,
      duration: 365,
      stripePriceId: 'price_1N3S99LFY6IEm8cQEZEcXKZq',
    } as Product,
    {
        name: 'Yearly - One Time',
        description: 'Premium!',
        price: '$70',
        stripePrice: 7000,
        recurring: false,
        duration: 365,
        stripePriceId: 'price_1N3S99LFY6IEm8cQ8lJlgqNL',
      } as Product,
  ]