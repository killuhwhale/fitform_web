import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { api } from "components/utils/api";
import { useEffect, useState } from "react";
import Header from "components/components/Header";
import { useRouter } from "next/router";

const SignInForm = () => {
  const login = api.login.login.useMutation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    console.log(`Email: ${email} - Password: ${password}`);

    // Replace console.log with API call to sign in user
    const loginResult = login.mutate({ email, password });

    console.log("Login Result:", login.data);
  };

  useEffect(() => {
    console.log("Logged in data: ", login);
    if (login.data && login.data.loggedIn && !token) {
      setToken(login.data.token);
      router
        .push("/")
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  }, [login.data]);

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 w-full max-w-md rounded-lg bg-white p-4 shadow-lg"
    >
      <h2 className="mb-4 text-lg font-medium text-gray-900">Sign In</h2>
      <div className="mb-4">
        <label htmlFor="email" className="mb-2 block font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          className="w-full rounded-lg border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="mb-2 block font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full rounded-lg border border-gray-400 p-2 focus:border-blue-500 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-400 focus:bg-blue-400 focus:outline-none"
      >
        Sign In
      </button>
    </form>
  );
};

const Login: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_APP_NAME ?? ""} - Login</title>
        <meta
          name="description"
          content="Fitness platform to track and visualize workouts."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#007cff] to-[#15162c]">
        <h1 className="text-5xl text-white">Login</h1>
        <SignInForm />
        <div className=" text-slate-300">
          <p>Dont have an account?</p>
          <p>Create an account via our mobile app!</p>
          <p>
            Download the app on{" "}
            <Link
              className="text-blue-600"
              href={process.env.APPLE_APP_STORE_APP_URL ?? ""}
              target="_blank"
            >
              Apple's App store
            </Link>{" "}
            or{" "}
            <Link
              className="text-green-600"
              href={process.env.GOOGLE_PLAY_STORE_APP_URL ?? ""}
              target="_blank"
            >
              Google's Play Store
            </Link>
          </p>
        </div>
      </main>
    </>
  );
};

export default Login;
