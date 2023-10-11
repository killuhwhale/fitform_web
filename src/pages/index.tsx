import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { useEffect, useState, PropsWithChildren, FC } from "react";
import Header from "components/components/Header";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "lib/config";
import { User } from "lib/session";
import { products } from "lib/stripe_config";

import ProductDisplay from "components/components/ProductDisplay";

import { env } from "components/env.mjs";
interface ImageTextRowProps {
  url: string;
}

const BouncingHeader: FC<{ text: string }> = (props) => {
  return (
    <div className=" inline-flex w-full flex-row items-center">
      <hr className="mx-auto my-4 mr-32 h-1 w-48 rounded border-0 bg-slate-300 md:my-20"></hr>
      <p className="animate-bounce p-4 text-xl text-slate-200">{props.text}</p>
      <hr className="mx-auto my-4 ml-32 h-1 w-48 rounded border-0 bg-slate-300 md:my-20"></hr>
    </div>
  );
};

const ImageAndTextRow: FC<PropsWithChildren<ImageTextRowProps>> = (props) => {
  return (
    <div className="container flex max-w-full flex-wrap content-center  items-center">
      <div className="md:w-1/2 md:px-4">
        <img
          src={props.url}
          alt="My Image"
          width={500}
          height={500}
          className="md:float-right md:mr-12"
          style={{
            objectFit: "contain",
            objectPosition: "right",
            borderRadius: 8,
          }}
        />
      </div>

      <div className="mx-auto  md:w-1/2 md:px-4">
        <ul className="mx-auto list-disc content-center items-center justify-center md:ml-12">
          {props.children}
        </ul>
      </div>
    </div>
  );
};

const TextAndImageRow: FC<PropsWithChildren<ImageTextRowProps>> = (props) => {
  return (
    <div className="container flex max-w-full  flex-wrap content-center items-center">
      <div className="w-full lg:w-1/2 lg:px-4 ">
        <div className="lg:pr-12">
          <div className="float-right lg:w-[500px]">{props.children}</div>
        </div>
      </div>

      <div className="mx-auto w-full lg:w-1/2 lg:px-4">
        <img
          src={props.url}
          alt="My Image"
          className="sm:ml-12"
          width={500}
          height={500}
          style={{ borderRadius: 8 }}
        />
      </div>
    </div>
  );
};

const AppDownloadlinks: FC = () => {
  return (
    <div className="border-1 rounded-2xl border border-slate-300 p-5">
      <p className="pb-8 text-center text-xl text-green-400">
        Download Now on the App Store
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-8">
        <Link
          className="flex w-[420px] max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
          href="https://apps.apple.com/us/app/fitform-trackerr/id1661392215"
          target="_blank"
        >
          <h3 className="text-2xl font-bold">iOS →</h3>
          <img className="rounded-xl" src="/images/ios.svg"></img>
        </Link>
        <div className="flex  max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
          <h3 className="text-2xl font-bold">Android →</h3>
          <a href="https://play.google.com/store/apps/details?id=com.fitform&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
            <img
              alt="Get it on Google Play"
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    if (req.session.user) {
      const updateRes = await fetch(`${env.BASE_URL}/users/user_info/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${req.session.user.token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("updateRes: ", updateRes);
      if (updateRes.status == 200) {
        const updateUser: User = (await updateRes.json()) as User;

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
  // console.log("Page props", props);
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
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Fit<span className="text-[hsl(200,100%,70%)]">Trackrr</span>
          </h1>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white">
              Create, Plan and Track your workouts. Easily visualize your effort
              across time.
            </div>
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white">
              Manage your gym and members&apos; progress all in one place!
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

        <AppDownloadlinks />

        <BouncingHeader text="Membership" />

        <ImageAndTextRow url="/images/linechartA.png">
          <p className="p-4 text-xl text-cyan-100">
            Create and complete an unlimited number of workouts each day.
          </p>
          <p className="p-4 text-xl text-cyan-200">Run unlimited gyms.</p>
          <p className="p-4 text-xl text-cyan-300">Create unlimited classes.</p>
          <p className="p-4 text-xl text-cyan-300">Create private classes.</p>
          <p className="p-4 text-xl text-cyan-300">
            Allow Coaches to manage classes: Add/ remove workouts.
          </p>
          <p className="p-4 text-xl text-cyan-400">
            Give your Trainers & Coaches a place to host their workouts and
            monitor their clients&apos; workout volume.
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
          <p className="p-4 text-xl text-emerald-500">Future features:</p>
          <p className="p-4 text-xl text-emerald-500">
            - View your class members&apos; workout volume & stats.
          </p>
          <p className="p-4 text-xl text-emerald-500">
            - View other members workout volume & stats.
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
