import getStripe from "components/utils/getStripe";
import { Product, Products } from "lib/stripe_config";
import react, { useEffect, useState } from "react";
import { api } from "components/utils/api";
import ActionCancelModal from "./modals/ActionCancelModal";

interface ProductDisplayProps {
  products: Products;
  onSelect(stripePriceId: string): void;
}

const DISCLAIMER = `Your purchase is final and non-refundable.
Your membership will be valid for the duration specified at the time of purchase.
You will not be entitled to a refund or credit if you decide to cancel your membership early.
We reserve the right to modify, suspend or terminate your membership at any time, without notice, for any reason. (but most likely only if you are hacking us...)`;

const ProductDisplay: react.FC<ProductDisplayProps> = (props) => {
  const [selected, setSelected] = useState(props.products[0]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const checkoutSession = api.stripe.checkout_sessions.useMutation();

  const onChange = (product: Product) => {
    setSelected(product);
    props.onSelect(product.stripePriceId);
  };

  useEffect(() => {
    const redirect = async () => {
      if (!checkoutSession.data?.stripeSession) return;
      // Redirect to Checkout.
      const stripe = await getStripe();
      const { error } = await stripe!.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: checkoutSession.data.stripeSession.id,
      });
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `error.message`.
      console.warn("Error w/ redirect product display", error.message);
      setLoading(false);
    };

    redirect()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, [checkoutSession.data?.stripeSession]);

  const handleSubmit = () => {
    setLoading(true);
    if (!selected) return;
    // if (checkoutSession.data?.stripeSession) {
    // Modify/ cancel or delete the session before creating a new one??
    // }
    checkoutSession.mutate(selected);
  };

  return (
    <div>
      <div className="grid grid-cols-1 items-center justify-center gap-2  sm:w-[600px] sm:grid-cols-2">
        <div
          className={` flex h-full w-full  cursor-pointer flex-row items-center rounded-xl p-8`}
        >
          <p className="w-full text-center text-3xl text-white">Subscription</p>
        </div>
        <div
          className={` flex h-full w-full  cursor-pointer flex-row items-center rounded-xl p-8`}
        >
          <p className="w-full text-center text-3xl text-white">One Time</p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-center justify-center gap-2  sm:w-[600px] sm:grid-cols-2">
        {props.products.map((product: Product, idx: number) => {
          const isSelected = selected?.stripePriceId === product.stripePriceId;
          const bgColor =
            idx % 2 == 0 ? "white bg-fuchsia-700" : "slate-200 bg-cyan-500";
          const borderColor = isSelected
            ? "border-rose-500"
            : idx % 2 == 0
            ? "border-fuchsia-700"
            : "border-cyan-500";
          return (
            <div
              key={product.stripePriceId}
              onClick={() => onChange(product)}
              className={`text-${bgColor} ${borderColor} flex h-full w-full cursor-pointer flex-row  items-center rounded-xl border border-2 p-8`}
            >
              <input
                id="default-radio-1"
                type="radio"
                value=""
                checked={isSelected}
                name="default-radio"
                className="mr-4 h-4 w-4 border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
              />
              <div className="w-full">
                <p className="text-center">{product.name}</p>
                <p className="text-center">
                  {product.price} - {product.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 w-full items-center justify-center ">
        <input
          type="hidden"
          name="lookup_key"
          value={selected?.stripePriceId}
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="border-white-100 w-full  border bg-indigo-700 p-4 text-center text-white hover:bg-indigo-900 focus:bg-cyan-700 active:bg-cyan-800"
          type="submit"
          disabled={loading}
        >
          Checkout {selected?.name} - {selected?.price}
        </button>

        <ActionCancelModal
          isOpen={isModalOpen}
          message={`Confirm subscription: ${selected?.name ?? ""} ${
            selected?.description ?? ""
          } ${selected?.price ?? ""}`}
          onClose={() => setIsModalOpen(false)}
          onAction={() => handleSubmit()}
          note={DISCLAIMER}
        />
      </div>
    </div>
  );
};
export default ProductDisplay;
