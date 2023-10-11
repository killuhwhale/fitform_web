import Header from "components/components/Header";
import { api } from "components/utils/api";
import getStripe from "components/utils/getStripe";
import { User } from "lib/session";
import { NextPage } from "next";
import Head from "next/head";
import router, { useRouter } from "next/router";
import { useEffect } from "react";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "lib/config";
import Stripe from "stripe";
import { products } from "lib/stripe_config";
import { env } from "components/env.mjs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
  typescript: true,
});

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, query }) {
    /** When a Checkout is successful, Stripe redirects to this Page.
     *
     * We need to update the user session from our django server.
     *
     *
     */
    try {
      console.log("Succ sersProps ", query);
      if (!query.session_id) throw new Error("SessionID not given.!");

      const checkoutSession = await stripe.checkout.sessions.retrieve(
        query.session_id.toString()
      );
      console.log("Checkout Session: ", checkoutSession);

      if (query.success && req.session.user?.email) {
        const updateRes = await fetch(`${env.BASE_URL}/users/user_info/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${req.session.user.token}`,
            "Content-Type": "application/json",
          },
        });
        const updateUser: User = (await updateRes.json()) as User;

        if (updateUser.id && updateUser.email) {
          req.session.user = { ...req.session.user, ...updateUser };
          await req.session.save();
          return {
            props: {
              user: req.session.user || null,
            },
          };
        }
      }
    } catch (err) {
      console.log("Error ssp ", err);
    }

    return {
      props: {
        user: req.session.user || null,
      },
    };
  },
  ironOptions
);

const SubscriptionSuccessPage: NextPage<{ user: User }> = (props) => {
  /** The user is redirected to this page after Success payment with Stripe.
   *
   * Stripe sends back {success: bool, sessionId: string}
   *
   * We then create a Portal Session on the server using a tRPC mutation.
   *
   * The mutation will set data to portalStream URL that Stripe Generated.
   *
   * UseEffect will then be called and will redirect user to Stripes Portal where
   *   the user can manage their subscriptions.
   *
   *
   * handleSubmit - Starts the creation of the portal session.
   */
  const portal = api.stripe.portalSession.useMutation();
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    if (!portal.data?.portalSession) return;
    // Redirect to Checkout.
    console.log("Pushing url", portal.data?.portalSession.url);
    window.location.href = portal.data?.portalSession.url;
    // async function redirect() {
    // }

    // redirect()
    //   .then((res) => console.log(res))
    //   .catch((err) => console.log(err));
  }, [portal.data?.portalSession]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    /** Starts portal stream via mutation.  */
    e.preventDefault();
    console.log("Session id", query, query.session_id);
    if (query.session_id) {
      portal.mutate({ sessionId: query.session_id.toString() });
    }
  };

  return (
    <>
      <Head>
        <title>FitTrackrr</title>
        <meta
          name="description"
          content="Fitness platform to track and visualize workouts."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header user={props.user} />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#007cff] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          {query.success ? (
            /** Generated by ChatGPT */
            <div className="rounded-lg bg-blue-500 px-6 py-4 text-white sm:w-[650px]">
              <p className="mb-2 text-lg font-bold">
                Welcome to our community!
              </p>
              <p className="text-base">
                {
                  " Thanks for subscribing to our app. You're now part of the FitTrackrr community. We can't wait to see all your workouts to come. Happy Fitnessing!"
                }
              </p>
            </div>
          ) : (
            <></>
          )}
          <form onSubmit={handleSubmit} method="POST">
            <input type="hidden" id="session-id" name="session_id" />
            <button
              id="checkout-and-portal-button"
              className="border border-emerald-400 bg-indigo-600 p-4 text-xl text-white hover:bg-cyan-700 focus:bg-cyan-700 active:bg-cyan-800"
              type="submit"
            >
              Manage your billing information
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default SubscriptionSuccessPage;
