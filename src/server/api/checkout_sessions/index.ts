import { NextApiRequest, NextApiResponse } from "next";

import {
  CURRENCY,
  MIN_AMOUNT,
  MAX_AMOUNT,
  Product,
  products,
} from "../../../../lib/stripe_config";
import { formatAmountForStripe } from "../../../utils/stripe_helpers";

import getStripe from "../../../utils/getStripe";
import Stripe from "stripe";
import { LineItem } from "@stripe/stripe-js";
import { getBaseUrl } from "components/utils/api";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

// const stripe = await getStripe(

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
  typescript: true,
});

export const stripeRouter = createTRPCRouter({
  checkout_sessions: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.string(),
        stripePriceId: z.string(),
        recurring: z.boolean(),
        stripePrice: z.number(),
        duration: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!stripe) return;
      const res = ctx.res;
      const req = ctx.req;

      // const product: Product = req.body.product
      const product: Product = input;
      try {
        // Validate the stripePriceId that was passed from the client.
        if (
          products
            .map((product) => product.stripePriceId)
            .indexOf(product.stripePriceId) < 0
        ) {
          throw new Error("Invalid product id.");
        }

        // I need to create a sub or apayment depedning on product...

        // Create Checkout Sessions from body params.

        console.log("Looked up prices...");
        const customers = await stripe.customers.list({
          email: ctx.user.email,
        });
        const customer = customers.data[0];
        if (!customer)
          return res
            .status(500)
            .json({ statusCode: 500, message: "Unable to get customer ID." });
        const customerId = customer.id;
        const md = {
          metadata: {
            duration: product.duration,
            product_id: product.stripePriceId,
          },
        };

        console.log("Metadata for stripe: ", md);
        const stripeCheckoutData = {
          billing_address_collection: "auto",
          customer: customerId,
          mode: product.recurring ? "subscription" : "payment",
          success_url: `${getBaseUrl()}/subscriptionSuccess?success=true&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${getBaseUrl()}?canceled=true`,
          line_items: [
            {
              price: product.stripePriceId,
              // For metered billing, do not pass quantity
              quantity: 1,
            },
          ],
        } as Stripe.Checkout.SessionCreateParams;

        if (product.recurring) {
          stripeCheckoutData.subscription_data = md;
        } else {
          stripeCheckoutData.payment_intent_data = md;
        }
        console.log("Stripe Checkout: ", stripeCheckoutData);
        const session = await stripe.checkout.sessions.create(
          stripeCheckoutData
        );

        console.log("Stripe session res: ", session);
        return { stripeSession: session };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Internal server error";
        console.log("error: ", errorMessage);
        res.status(500).json({ statusCode: 500, message: errorMessage });
      }
    }),

  portalSession: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log("Mutating...");
      if (!stripe) return;
      const res = ctx.res;
      const req = ctx.req;
      try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(
          input.sessionId
        );
        console.log("Portal for sessions id:", input.sessionId);
        if (!checkoutSession.customer) return console.log("No cutsomer");
        // This is the url to which the customer will be redirected when they are done
        // managing their billing with the portal.

        const portalSession = await stripe.billingPortal.sessions.create({
          customer: checkoutSession.customer.toString(),
          return_url: getBaseUrl(),
        });
        console.log(
          "Returning portal session",
          portalSession.url,
          portalSession
        );
        return { portalSession: portalSession };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Internal server error";
        console.log("Error portal", err);
        res.status(500).json({ statusCode: 500, message: errorMessage });
      }
    }),
});
