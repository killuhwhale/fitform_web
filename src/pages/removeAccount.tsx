import Header from "components/components/Header";
import { User } from "lib/session";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "lib/config";

import { env } from "components/env.mjs";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { api } from "components/utils/api";

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
        console.log("updateUser: ", updateUser);

        if (updateUser.id && updateUser.email) {
          req.session.user = { ...req.session.user, ...updateUser };
          await req.session.save();
          return {
            props: {
              user: req.session.user || null,
            },
          };
        } else if (updateUser.error) {
          req.session.user = {} as User;
          await req.session.save();
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

const RemoveAccountConfirm: FC<{ email: string }> = ({ email }) => {
  const [cEmail, setEmail] = useState("");
  const [rmMessage, setRmMessage] = useState("");
  const rmAccount = api.login.removeAccount.useMutation();

  const removeAccount = () => {
    if (cEmail === email) {
      console.log("removing account");
      rmAccount.mutate({ email: email });
    } else {
      alert(
        `Email entered: ${cEmail} does not match registered email : ${email}`
      );
    }
  };

  useEffect(() => {
    if (rmAccount.data && rmAccount.data.success && rmMessage.length === 0) {
      setRmMessage("Account removed sucessfully!");
    } else if (
      rmAccount.data &&
      rmAccount.data.success === false &&
      rmMessage.length === 0
    ) {
      setRmMessage(`Failed to remove accout: ${rmAccount.data.error}`);
    }
  }, [rmAccount.data]);

  return (
    <div className="w-full items-center justify-center">
      <div className="flex w-3/4 justify-center">
        <p className="text-center">{email}</p>
      </div>
      <div className="flex w-full flex-row items-center justify-center">
        <div className="flex w-3/4 justify-center">
          <input
            type="text"
            value={cEmail}
            //   placeholder={email}
            onChange={(ev: ChangeEvent<HTMLInputElement>) =>
              setEmail(ev.target.value)
            }
            className="h-[25px] w-1/2 bg-stone-950  pl-2 text-lg text-red-400"
          />
        </div>
        <div className="flex w-1/4 justify-center">
          <button
            onClick={() => removeAccount()}
            className="h-[25px] w-1/2 bg-rose-500  hover:bg-rose-800    active:bg-rose-500"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

const RemoveAccountPage: NextPage<{ user: User }> = (props) => {
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
            <p className="mb-2 text-center text-lg font-bold">Remove Account</p>
            <p className="mb-2 text-lg">
              If you want to remove your account please enter your email and
              press submit.
            </p>
            {props.user ? (
              <RemoveAccountConfirm email={props.user.email} />
            ) : (
              <p>Must be signed in to remove your account.</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default RemoveAccountPage;
