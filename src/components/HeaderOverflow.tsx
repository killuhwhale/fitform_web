import Link from "next/link";
import { User } from "lib/session";
import { api, getBaseUrl } from "components/utils/api";
import ManageSub from "./ManageSub";
import { useEffect } from "react";

const Header: React.FC<{ user?: User }> = (props) => {
  const logout = api.login.logout.useMutation({});
  useEffect(() => {
    if (logout.data?.loggedOut) {
      console.log("Logged out!");
      window.location.href = getBaseUrl();
    }
  }, [logout.data?.loggedOut]);

  console.log("Header", props.user);

  return (
    <header className="flex items-center justify-between bg-gradient-to-b from-blue-400 to-blue-500 px-4 py-3">
      <div className="flex items-center">
        <Link
          href="/"
          className="text-lg font-bold text-slate-200 hover:text-slate-700"
        >
          <span>{process.env.NEXT_PUBLIC_APP_NAME ?? ""}ttt</span>
        </Link>
      </div>
      <div className="flex items-center">
        {!props.user?.token ? (
          <Link
            href="/login"
            className="rounded bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-400"
          >
            <span>Log In</span>
          </Link>
        ) : (
          <div className="flex flex-row items-center">
            <h2 className="align-center mr-4 text-slate-200 hover:text-slate-700">
              {props.user.email} ({props.user.customer_id})
            </h2>
            {new Date(props.user.sub_end_date) > new Date() ? (
              <div className="mr-4 rounded-lg bg-emerald-600 p-1 text-white hover:bg-cyan-700 focus:bg-cyan-700 active:bg-cyan-800">
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
    </header>
  );
};

export default Header;
