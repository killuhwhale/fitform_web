import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from 'next/image'
import { api } from "components/utils/api";
import react, {useEffect, useState} from 'react';
import Header from "components/components/Header";
import { useRouter } from "next/router";



const SignInForm = () => {
    const login = api.login.login.useMutation();
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [token, setToken] = useState("")

    const handleSubmit = (event: { preventDefault: () => void; }) => {
      event.preventDefault()
      console.log(`Email: ${email} - Password: ${password}`)

      // Replace console.log with API call to sign in user
     const loginResult =  login.mutate({ email,password })


      console.log("Login Result:", login.data)
    }


    useEffect(() => {
      console.log("Logged in data: ", login)
      if(login.data && login.data.loggedIn && !token){
        setToken(login.data.token)
        router.push("/")
      }
    }, [login.data])

    return (
      <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mt-8 p-4 rounded-lg shadow-lg bg-white">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Sign In</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
          <input
            id="email"
            type="email"
            className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
          <input
            id="password"
            type="password"
            className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-400 focus:outline-none focus:bg-blue-400"
        >
          Sign In
        </button>
      </form>
    )
  }




const Login: NextPage = () => {
    // const hello = api.example.hello.useQuery({ text: "from tRPC" });

    return (
      <>
        <Head>
          <title>FitForm - Login</title>
          <meta name="description" content="Fitness platform to track and visualize workouts." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#007cff] to-[#15162c]">
            <h1 className="text-white text-5xl">Login</h1>
            <SignInForm />
        </main>
        </>
    )
}

export default Login