import React, { useState } from "react";
import "./App.css";
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import defaultTheme, { darkTheme, lightTheme } from "./utils/theme";
import {BrowserRouter as Router, Navigate, NavLink, Outlet, Route, Routes, useLocation} from "react-router-dom";
import AnimatedRoutes from "./components/animatedRoutes";
import {LoginContainer} from "./pages/user/login";
import {JoinContainer} from "./pages/user/join";
import {Main} from "./pages/main";
import {MainMapSearch} from "./components/main/mainMapSearch";
import {TestModal} from "./pages/testModal";
import indexStore from "./store/indexStore";
import {UserInfo} from "./components/user/user.info";

function isLogin() {
    return !!localStorage.getItem("accessToken");
}

function verify(element) {
    // console.log('sodiApi.user.verify()', await sodiApi.user.verify())
    return isLogin() ? element : <Navigate to={"/auth/login"} />;
}

const Logout = React.memo(() => {
    localStorage.removeItem("accessToken");
    return <Navigate to={'/auth/login'} />;
});

function App() {
  const [myTheme, setTheme] = useState(defaultTheme);
  const [mode, setMode] = useState("light");


    const location = useLocation();
    const background = location.state && location.state.background;
    console.log("background", (!background || location));
  return (
    <ThemeProvider theme={myTheme}>
      <GlobalStyles
        styles={{
          html: {
            width: "100%",
            height: "100%",
            listStyle: "none",
            boxSizing: "border-box",
            position: "relative",
            fontFamily: "sans-serif",
          },
          body: {
            width: "100%",
            height: "100%",
            listStyle: "none",
            boxSizing: "border-box",
            position: "relative",
          },
          "#root": {
            width: "100%",
            height: "100%",
            position: "relative",
          },
          Container: {
            height: "100%",
            position: "absolute",
            width: "100vw",
            transition: { duration: "0.3s" },
          },
          container: {
            height: "100%",
            position: "absolute",
            width: "100vw",
            transition: { duration: "0.3s" },
          },
          ".leftBox": {
            "border-bottom-left-radius": "14px",
            "border-top-left-radius": "14px",
          },
          ".rightBox": {
            "border-bottom-right-radius": "14px",
            "border-top-right-radius": "14px",
          },
            ".MuiButton-containedPrimary": {
              color: 'white !important'
            }
        }}
      />
      <CssBaseline enableColorScheme={true} />

        {/*<nav style={{ position: 'fixed', zIndex: 9999 }}>*/}
        {/*  <NavLink to="/" end>*/}
        {/*    Home*/}
        {/*  </NavLink>*/}
        {/*  <NavLink to="/user/login">About</NavLink>*/}
        {/*  <NavLink to="/user/join">Contact</NavLink>*/}
        {/*</nav>*/}
        <Routes location={location}>
            <Route path={"/"} element={<Outlet />}>
                <Route path={''} element={<Navigate to={'/main/map'} />} />
                <Route path={"/auth/login"} element={<LoginContainer />} />
                <Route path={"/auth/join"} element={<JoinContainer />} />
                <Route path={"/main/map"} element={verify(<Main />)}>
                    <Route path={"search"} element={<MainMapSearch />} />
                    <Route path={"test"} element={<TestModal />} />
                    <Route path={"user"} element={<UserInfo />} />
                    <Route path={"logout"} element={<Logout />} />
                </Route>
            </Route>
            <Route path={"/main/post"} element={<JoinContainer />} />{" "}
            <Route path={"/main/post/create"} element={<JoinContainer />} />{" "}
            <Route path={"/main/post/modify"} element={<JoinContainer />} />{" "}
        </Routes>
    </ThemeProvider>
  );
}

export default App;
