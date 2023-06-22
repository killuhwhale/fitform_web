import React, { useState } from "react";

import getStripe from "components/utils/getStripe";
import { formatAmountForDisplay } from "components/utils/stripe_helpers";
import { AMOUNT_STEP, CURRENCY, MAX_AMOUNT } from "lib/stripe_config";

type StripeCheckoutSesh = { statusCode: number; id: string; message: string };

const CheckoutForm = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    customDonation: Math.round(MAX_AMOUNT / AMOUNT_STEP),
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    const _ = async () => {
      e.preventDefault();
      setLoading(true);
      // Create a Checkout Session.
      const _response = await fetch("/api/checkout_sessions", {
        body: JSON.stringify({ amount: input.customDonation }),
      });
      const response: StripeCheckoutSesh =
        (await _response.json()) as StripeCheckoutSesh;

      if (response.statusCode === 500) {
        console.error(response.message);
        return;
      }

      // Redirect to Checkout.
      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: response.id,
      });
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `error.message`.
      console.warn(error.message);
      setLoading(false);
    };
    _()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <button
        className="checkout-style-background"
        type="submit"
        disabled={loading}
      >
        Checkout {formatAmountForDisplay(input.customDonation, CURRENCY)}
      </button>
    </form>
  );
};

export default CheckoutForm;
