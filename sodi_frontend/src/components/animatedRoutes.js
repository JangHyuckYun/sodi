import {Navigate, Route, Routes, useLocation} from "react-router-dom";
import {LoginContainer} from "../pages/user/login";
import {JoinContainer} from "../pages/user/join";
import {Main} from "../pages/main";
import {TestModal} from "../pages/testModal";
import {sodiApi} from "../utils/api";
import React, {lazy} from "react";
import {MainMapSearch} from "./main/mainMapSearch";

function isLogin() {
  return !!localStorage.getItem("accessToken");
}

function verify(element) {
  // console.log('sodiApi.user.verify()', await sodiApi.user.verify())
  return isLogin() ? element : <Navigate to={"/auth/login"} />;
}

async function isLogin2() {
  return sodiApi.user.verify();
}

async function verify2(element) {
  // console.log('sodiApi.user.verify()', await sodiApi.user.verify())
  return lazy(async () =>
    (await isLogin2()) ? element : <Navigate to={"/auth/login"} />
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
      <>
          <Routes location={background || location}>
              <Route path={"/"} element={<p>asdasa</p>} />
              <Route path={"/auth/login"} element={<LoginContainer />} />
              <Route path={"/auth/join"} element={<JoinContainer />} />
              <Route path={"/main/map"} element={verify(<Main />)}>
                  {<Route path={"search"} element={<MainMapSearch />} /> }
                  { background && <Route path={"test"} element={<TestModal />} /> }
              </Route>
          </Routes>


          {background && (
              <Routes>
                  <Route path={"search"} element={<MainMapSearch />} />
              </Routes>
          )}
      </>
  );
}

export default AnimatedRoutes;
