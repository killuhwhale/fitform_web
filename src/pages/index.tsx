import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { api } from "components/utils/api";
import react, { useEffect, useState, PropsWithChildren } from "react";
import Header from "components/components/Header";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "lib/config";
import { User } from "lib/session";
import { CURRENCY, Product, Products, products } from "lib/stripe_config";
import CheckoutForm from "components/components/CheckoutForm";
import getStripe from "components/utils/getStripe";
import ProductDisplay from "components/components/ProductDisplay";
import ActionCancelModal from "components/components/modals/ActionCancelModal";
import { env } from "components/env.mjs";
interface ImageTextRowProps {
  url: string;
}

const BouncingHeader: react.FC<{ text: string }> = (props) => {
  return (
    <div className=" inline-flex w-full flex-row items-center">
      <hr className="mx-auto my-4 mr-32 h-1 w-48 rounded border-0 bg-slate-300 md:my-20"></hr>
      <p className="animate-bounce p-4 text-xl text-slate-200">{props.text}</p>
      <hr className="mx-auto my-4 ml-32 h-1 w-48 rounded border-0 bg-slate-300 md:my-20"></hr>
    </div>
  );
};

const ImageAndTextRow: react.FC<PropsWithChildren<ImageTextRowProps>> = (
  props
) => {
  return (
    <div className="container flex max-w-full flex-wrap content-center  items-center">
      <div className="px-4 sm:w-1/2">
        <Image
          src={props.url}
          alt="My Image"
          width={500}
          height={500}
          className="float-right mr-12"
          style={{
            objectFit: "contain",
            objectPosition: "right",
            borderRadius: 8,
          }}
        />
      </div>

      <div className="mx-auto w-full px-4 sm:w-1/2">
        <ul className="mx-auto ml-12 list-disc content-center items-center justify-center">
          {props.children}
        </ul>
      </div>
    </div>
  );
};

const TextAndImageRow: react.FC<PropsWithChildren<ImageTextRowProps>> = (
  props
) => {
  return (
    <div className="container flex max-w-full flex-wrap content-center  items-center">
      <div className="px-4 sm:w-1/2 ">
        <div className="pr-12">
          <div className="float-right w-[500px]">{props.children}</div>
        </div>
      </div>

      <div className="mx-auto w-full sm:w-1/2 sm:px-4">
        <Image
          src={props.url}
          alt="My Image"
          className="ml-12"
          width={500}
          height={500}
          style={{ borderRadius: 8 }}
        />
      </div>
    </div>
  );
};

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    if (req.session.user) {
      console.log("Fetching from: ", `${env.BASE_URL}/users/user_info/`);
      const updateRes = await fetch(`${env.BASE_URL}/users/user_info/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${req.session.user.token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("updateData: ", updateRes);
      if (updateRes.status == 200) {
        const updateUser = await updateRes.json();
        console.log("updateData: ", updateUser);
        if (updateUser.id && updateUser.email) {
          req.session.user = { ...req.session.user, ...updateUser };
          await req.session.save();
        }
      }
    }

    return {
      props: {
        user: req.session.user || null,
      },
    };
  },
  ironOptions
);

const Home: NextPage<{ user: User }> = (props) => {
  // const login = api.login.login.useMutation();
  console.log("Page props", props);
  return (
    <>
      <Head>
        <title>FitForm</title>
        <meta
          name="description"
          content="Fitness platform to track and visualize workouts."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header user={props.user} />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#007cff] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Fit<span className="text-[hsl(200,100%,70%)]">Form</span>
          </h1>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white">
              Manage your gym and members progress in one place!
            </div>
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white">
              Create, Plan and Track your workouts. Easily visualize your effort
              across time.
            </div>
          </div>
          <div className="border-1 rounded-2xl border border-slate-300 p-5">
            <p className="pb-8 text-center text-xl text-green-400">
              Download Now on the App Store
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
              <Link
                className="flex w-[420px] max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                href="https://apps.apple.com/us/app/fitform-trackerr/id1661392215"
                target="_blank"
              >
                <h3 className="text-2xl font-bold">iOS →</h3>
                <img className="rounded-xl" src="/images/iosStore.jpeg"></img>
              </Link>
              <Link
                className="flex  max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                href="https://play.google.com/store/apps/details?id=com.fitform"
                target="_blank"
              >
                <h3 className="text-2xl font-bold">Android →</h3>
                <img
                  className=" max-h-[145px] w-96 rounded-xl object-fill"
                  src="/images/googleplayA.jpeg"
                />
              </Link>
            </div>
          </div>
        </div>

        <div>
          {new Date(props.user?.sub_end_date) > new Date() ? (
            <div className="animate-pulse text-3xl text-emerald-200 ">
              Membership Active
            </div>
          ) : props.user?.token ? (
            <ProductDisplay
              onSelect={(product) => console.log("selected product: ", product)}
              products={products}
            />
          ) : (
            <h2 className="text-3xl  text-white">
              Sign in to see membership options!
            </h2>
          )}
        </div>

        <BouncingHeader text="Membership" />

        <ImageAndTextRow url="/images/linechartA.png">
          <p className="p-4 text-xl text-cyan-100">
            Create and complete an unlimited number of workouts each day.
          </p>
          <p className="p-4 text-xl text-cyan-200">Run unlimited gyms.</p>
          <p className="p-4 text-xl text-cyan-300">Create unlimited classes.</p>
          <p className="p-4 text-xl text-cyan-400">
            Create unlimited workouts for each class..
          </p>
        </ImageAndTextRow>

        <BouncingHeader text="Features" />

        <TextAndImageRow url="/images/chartA.png">
          <p className="p-4 text-xl text-emerald-100">
            Follow your favorite gyms and classes.
          </p>
          <p className="p-4 text-xl text-emerald-200">
            Complete workouts created by other gyms and classes.
          </p>
          <p className="p-4 text-xl text-emerald-300">
            Create private classes for online personal coaching.
          </p>
          <p className="p-4 text-xl text-emerald-400">
            View your stats: see charts and graphs that summarize your workouts.
          </p>
          <p className="p-4 text-xl text-emerald-500">
            Future: View your class members workouts.
          </p>
        </TextAndImageRow>

        <hr className="mx-auto my-4 h-1 w-48 rounded border-0 bg-slate-300 md:my-20"></hr>

        <p className="text-2xl text-transparent">
          ios android mobile fitness app workout tracker gym workouts community
          exercise get in shape track my workouts Workout Log App App to Track
          Workouts Weight Lifting App Exercise Log Best Gym App 5x5 App Training
          Diary Fitness Log Best Workout App Gym Program App Weight Lifting
          Tracker Strength Training App Powerlifting App Gym Log App Lifting App
          Workout Logger Workout Tracker Fitness App Bodybuilding App
        </p>
      </main>
    </>
  );
};

export default Home;
