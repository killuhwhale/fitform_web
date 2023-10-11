import Header from "components/components/Header";
import { User } from "lib/session";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "lib/config";

import { env } from "components/env.mjs";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, query }) {
    /** When a Checkout is successful, Stripe redirects to this Page.
     *
     * We need to update the user session from our django server.
     *
     *
     */
    try {
      if (req.session.user?.token) {
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
      console.log("Error policy ssp ", err);
    }

    return {
      props: {
        user: req.session.user || null,
      },
    };
  },
  ironOptions
);

const PrivacyPolicyPage: NextPage<{ user: User }> = (props) => {
  const router = useRouter();
  const { query } = router;

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
          <div className="rounded-lg bg-blue-500 px-6 py-4 text-white sm:w-[650px]">
            <p className="mb-2 text-center text-lg font-bold">Privacy Policy</p>
            <p className="mb-2 text-lg">
              At FitTrackrr, we respect your personal information and, as such,
              have created this Privacy Policy to demonstrate our firm
              commitment to your privacy.
            </p>
            <ul className="list-disc">
              <span className="font-medium">1. Information We Collect</span>
              <li className="ml-6">
                When you use FitTrackrr, we collect: Login Information: This
                includes your email address, and password. We use this
                information to allow you to log into our application and access
                its features.
              </li>
              <span className="font-medium">
                2. How We Use Your Information
              </span>
              <li className="ml-6">
                We use the information we collect to: Allow you to access and
                use FitTrackrr. Ensure the secure functioning of our services.
                Respond to support and help requests.
              </li>
              <span className="font-medium">
                3. How We Protect Your Information
              </span>
              <li className="ml-6">
                Data Security: We have implemented necessary electronic and
                managerial procedures to safeguard and secure the information we
                collect. Password: Your password is stored securely using
                encryption methods.
              </li>
              <span className="font-medium">4. Payments</span>
              <li className="ml-6">
                We do not store any of your payment information on our servers.
                All payment-related processes, if any, are securely handled by a
                3rd party payment processor.
              </li>
              <span className="font-medium">5. Sharing Your Information</span>
              <li className="ml-6">
                We will not sell, distribute, or lease your personal information
                to third parties unless we have your permission or are required
                by law to do so.
              </li>
              <span className="font-medium">6. Changes to This Policy</span>
              <li className="ml-6">
                From time to time, we may update our Privacy Policy. We
                encourage users to frequently check this page for any changes.
                You acknowledge and agree that it is your responsibility to
                review this Privacy Policy periodically and be aware of
                modifications.
              </li>
              <span className="font-medium">
                7. Your Acceptance of These Terms
              </span>
              <li className="ml-6">
                By using FitTrackrr, you signify your acceptance of this policy.
                If you do not agree to this policy, please do not use our app.
              </li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
};

export default PrivacyPolicyPage;
