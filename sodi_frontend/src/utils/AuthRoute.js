import { Route } from "react-router-dom";
import { RedirectFunction, useNavigate } from "react-router";
import { sodiApi } from "./api";

const Redirect = ({ url }) => {
  const navigate = useNavigate();
  navigate("/auth/login");

  return <></>;
};

export const AuthRoute = ({ element, ...rest }) => {
  console.log(element, rest);
  return <Route
      async
    {...rest}
    element={sodiApi.user.verify() ? element : <div></div>} />;
};
