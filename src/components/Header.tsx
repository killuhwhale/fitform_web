import Link from "next/link";
import { User } from "lib/session";
import { api, getBaseUrl } from "components/utils/api";
import ManageSub from "./ManageSub";
import { useEffect, useRef, useState } from "react";

const Header: React.FC<{ user?: User }> = (props) => {
  const logout = api.login.logout.useMutation({});

  const [isHidden, setIsHidden] = useState(true);
  const [menuHidden, setMenuHidden] = useState(true);

  const burgerRef = useRef();
  const menuRef = useRef<React.ReactNode>();
  useEffect(() => {
    if (logout.data?.loggedOut) {
      console.log("Logged out!");
      window.location.href = getBaseUrl();
    }
  }, [logout.data?.loggedOut]);

  // console.log("Header", props.user);

  return (
    <>
      <nav className="white relative flex items-center justify-between bg-gradient-to-b from-blue-400 to-blue-500 px-4 py-4">
        <Link
          href="/"
          className="flex flex-row items-center justify-center text-lg font-bold text-slate-200 hover:text-slate-700 "
        >
          <img
            src="/images/icon_7.png"
            className="h-[40px] sm:h-[48px] lg:h-[64px]"
            style={{ borderRadius: 100 }}
          />
          <span className="ml-8">{process.env.NEXT_PUBLIC_APP_NAME ?? ""}</span>
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => {
              setIsHidden(!isHidden);
              setMenuHidden(true);
            }}
            className="navbar-burger flex items-center p-3 text-blue-600"
          >
            <svg
              className="block h-4 w-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Mobile menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>

        <div className={`${menuHidden ? "hidden " : ""} md:flex`}>
          {/* <div
          className={`${
            menuHidden ? "hidden" : ""
          } absolute left-3/4 top-1/2  -translate-x-3/4 -translate-y-1/2 transform md:mx-auto md:flex md:flex md:w-auto md:items-center md:space-x-6`}
        > */}
          <div className="flex w-full items-center ">
            {!props.user?.token ? (
              <Link
                href="/login"
                className="mr-4 rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
              >
                <span>Log In</span>
              </Link>
            ) : (
              <div className="flex flex-row items-center">
                <div className="flex flex-col">
                  <p className="align-center mr-4  text-slate-200 hover:text-slate-700 md:text-sm lg:text-lg">
                    {props.user.email}
                  </p>
                  <p className="align-center mr-4  text-slate-200 hover:text-slate-700 md:text-sm lg:text-lg">
                    ({props.user.customer_id})
                  </p>
                </div>
                {new Date(props.user.sub_end_date) > new Date() ? (
                  <div className="mr-4 rounded-lg bg-emerald-600 p-1 text-white hover:bg-cyan-700 focus:bg-cyan-700 active:bg-cyan-800 md:w-[180px]">
                    <ManageSub />
                  </div>
                ) : (
                  <p></p>
                )}
                <Link
                  href="/"
                  onClick={() => logout.mutate({})}
                  className="rounded bg-blue-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-400 md:w-[180px]"
                >
                  <span>Log Out</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div
        onClick={() => setIsHidden(!isHidden)}
        className={`${
          isHidden && menuHidden ? "hidden" : ""
        }  navbar-menu relative z-50 `}
      >
        <div className="navbar-backdrop fixed inset-0 bg-gray-800 opacity-25"></div>
        <nav className="fixed bottom-0 left-0 top-0 flex w-5/6 max-w-sm flex-col overflow-y-auto border-r bg-white px-6 py-6">
          <div className="mb-8 flex items-center">
            <Link className="mr-auto text-5xl font-bold leading-none" href="/">
              <svg className="h-12" viewBox="0 0 100 100">
                <path d="M100 34.2c-.4-2.6-3.3-4-5.3-5.3-3.6-2.4-7.1-4.7-10.7-7.1-8.5-5.7-17.1-11.4-25.6-17.1-2-1.3-4-2.7-6-4-1.4-1-3.3-1-4.8 0-5.7 3.8-11.5 7.7-17.2 11.5L5.2 29C3 30.4.1 31.8 0 34.8c-.1 3.3 0 6.7 0 10v16c0 2.9-.6 6.3 2.1 8.1 6.4 4.4 12.9 8.6 19.4 12.9 8 5.3 16 10.7 24 16 2.2 1.5 4.4 3.1 7.1 1.3 2.3-1.5 4.5-3 6.8-4.5 8.9-5.9 17.8-11.9 26.7-17.8l9.9-6.6c.6-.4 1.3-.8 1.9-1.3 1.4-1 2-2.4 2-4.1V37.3c.1-1.1.2-2.1.1-3.1 0-.1 0 .2 0 0zM54.3 12.3L88 34.8 73 44.9 54.3 32.4V12.3zm-8.6 0v20L27.1 44.8 12 34.8l33.7-22.5zM8.6 42.8L19.3 50 8.6 57.2V42.8zm37.1 44.9L12 65.2l15-10.1 18.6 12.5v20.1zM50 60.2L34.8 50 50 39.8 65.2 50 50 60.2zm4.3 27.5v-20l18.6-12.5 15 10.1-33.6 22.4zm37.1-30.5L80.7 50l10.8-7.2-.1 14.4z"></path>
              </svg>
            </Link>
            <button className="navbar-close">
              <svg
                className="h-6 w-6 cursor-pointer text-gray-400 hover:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
          <div>
            <ul>
              <li className="mb-1">
                <Link
                  className="block rounded p-4 text-sm font-semibold text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                  href="/"
                >
                  Home
                </Link>
              </li>
            </ul>
          </div>
          <div className="mt-auto">
            <div className="pt-6">
              <div className="flex flex-col items-center">
                {!props.user?.token ? (
                  <Link
                    href="/login"
                    className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
                  >
                    <span>Log In</span>
                  </Link>
                ) : (
                  <div className="flex  flex-col  items-center">
                    <h2 className="mr-4 text-center text-slate-600 hover:text-slate-700">
                      {props.user.email} ({props.user.customer_id})
                    </h2>

                    {new Date(props.user.sub_end_date) > new Date() ? (
                      <div className="m-4 rounded-lg bg-emerald-600 p-1 text-white hover:bg-cyan-700 focus:bg-cyan-700 active:bg-cyan-800">
                        <ManageSub />
                      </div>
                    ) : (
                      <p></p>
                    )}
                    <Link
                      href="/"
                      onClick={() => logout.mutate({})}
                      className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
                    >
                      <span>Log Out</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <p className="my-4 text-center text-xs text-gray-400">
              <span>Copyright © 2021</span>
            </p>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
