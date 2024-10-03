/*import { Outlet, Navigate } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "./Spinner";

export default function PrivateRoute() {
  const { loggedIn, checkingStatus } = useAuthStatus();
  if (checkingStatus) {
    return <Spinner />;
  }
  return loggedIn ? <Outlet /> : <Navigate to="/auth/login" />;
}*/

"use client"; 

import { useRouter } from "next/navigation";
import { useAuthStatus } from "../../hooks/useAuthStatus";

export default function PrivateRoute({ children }) {
  const { loggedIn, checkingStatus } = useAuthStatus();
  const router = useRouter();

  if (checkingStatus) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Please wait, checking authentication status...</p>
      </div>
    );
  };

  if (!loggedIn) {
    router.push("/auth/login");
    return null;
  };

  return <>{children}</>;
};