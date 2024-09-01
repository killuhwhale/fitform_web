import getStripe from "components/utils/getStripe";
import { Product, Products } from "lib/stripe_config";
import react, { useEffect, useState } from "react";
import { api } from "components/utils/api";
import ActionCancelModal from "./modals/ActionCancelModal";

interface ProductDisplayProps {
  products: Products;
  userToken?: string;
  onSelect(stripePriceId: string): void;
}

const DISCLAIMER = `Your purchase is final and non-refundable.
Your membership will be valid for the duration specified at the time of purchase.
You will not be entitled to a refund or credit if you decide to cancel your membership early.
We reserve the right to modify, suspend or terminate your membership at any time, without notice, for any reason. (but most likely only if you are hacking us...)`;

/**
 *
 * <div
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
 *
 *
 *
 *
 */

const ProductCard: react.FC<{
  product: Product;
  idx: number;
  isSelected: boolean;
  onChange(product: Product): void;
}> = ({ product, idx, isSelected, onChange }) => {
  const borderColor = isSelected ? "border-rose-500" : "border-gray-700";
  const plans = [
    "Monthy Subscription",
    "Single Month",
    "Yearly Subscription",
    "Single Year",
  ];
  const durations = ["/month", "for a month", "/year", "for a year"];
  return (
    <div
      onClick={() => onChange(product)}
      className={`${borderColor} w-full max-w-sm rounded-lg border   bg-gray-800 p-4 shadow sm:p-8`}
    >
      <h5 className="mb-4 text-xl font-medium text-gray-400">{plans[idx]}</h5>
      <div className="flex items-baseline text-white">
        <span className="text-3xl font-semibold">$</span>
        <span className="text-5xl font-extrabold tracking-tight">
          {product.price
            .replaceAll("$", "")
            .replaceAll("$", "")
            .replaceAll("/", "")
            .replaceAll("month", "")
            .replaceAll("year", "")}
        </span>
        <span className="ml-1 text-xl font-normal text-gray-400">
          {durations[idx]}
        </span>
      </div>

      <div role="list" className="my-7"></div>
      <ul role="list" className="my-7 space-y-5">
        <li className="flex space-x-3">
          <svg
            aria-hidden="true"
            className="h-5 w-5 flex-shrink-0 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Check icon</title>
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="text-base font-normal leading-tight text-gray-400">
            {idx % 2 === 0 ? "Recurring payment" : "Single Payment"}
          </span>
        </li>
        <li className="flex space-x-3">
          <svg
            aria-hidden="true"
            className="h-5 w-5 flex-shrink-0 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Check icon</title>
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="text-base font-normal leading-tight text-gray-400">
            Unlimited access! Create unlimted workouts.
          </span>
        </li>
        {/*  <li className="flex space-x-3">
          <svg
            aria-hidden="true"
            className="h-5 w-5 flex-shrink-0 text-blue-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Check icon</title>
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="text-base font-normal leading-tight text-gray-400">
            Integration help
          </span>
        </li>
        <li className="flex space-x-3 line-through decoration-gray-500">
          <svg
            aria-hidden="true"
            className="h-5 w-5 flex-shrink-0 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Check icon</title>
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="text-base font-normal leading-tight text-gray-500">
            Sketch Files
          </span>
        </li>
        <li className="flex space-x-3 line-through decoration-gray-500">
          <svg
            aria-hidden="true"
            className="h-5 w-5 flex-shrink-0 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Check icon</title>
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="text-base font-normal leading-tight text-gray-500">
            API Access
          </span>
        </li>
        <li className="flex space-x-3 line-through decoration-gray-500">
          <svg
            aria-hidden="true"
            className="h-5 w-5 flex-shrink-0 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Check icon</title>
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="text-base font-normal leading-tight text-gray-500">
            Complete documentation
          </span>
        </li>
        <li className="flex space-x-3 line-through decoration-gray-500">
          <svg
            aria-hidden="true"
            className="h-5 w-5 flex-shrink-0 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Check icon</title>
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="text-base font-normal leading-tight text-gray-500">
            24×7 phone & email support
          </span>
        </li> */}
      </ul>
      <button
        type="button"
        className="f inline-flex w-full justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-900"
      >
        Choose plan
      </button>
    </div>
  );
};

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
    if (!props.userToken) return alert("User information not found.");
    if (!selected) return;
    setLoading(true);
    // if (checkoutSession.data?.stripeSession) {
    // Modify/ cancel or delete the session before creating a new one??
    // }
    checkoutSession.mutate(selected);
  };

  return (
    <div className="mb-16">
      <div className="hidden   grid-cols-1 items-center justify-center gap-2 sm:grid  sm:w-[600px] sm:grid-cols-2">
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

          return (
            <ProductCard
              key={`product_d_${product.stripePriceId}`}
              product={product}
              idx={idx}
              isSelected={isSelected}
              onChange={onChange}
            />
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
          {props.userToken
            ? `Checkout ${selected?.name} - ${selected?.price}`
            : "Sign in to join!"}
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
