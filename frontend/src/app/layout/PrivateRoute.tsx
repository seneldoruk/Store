import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
import { toast } from "react-toastify";

export const PrivateRoute = ({ children }: any) => {
  const { user } = useAppSelector((state) => state.account);

  if (!user) {
    toast.error("Must be logged in to check out", { toastId: "Login" });
    return <Navigate to="/login" replace />;
  }

  return children;
};
