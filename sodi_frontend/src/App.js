import React, {useState} from "react";
import {CssBaseline, GlobalStyles, ThemeProvider} from "@mui/material";
import defaultTheme from "./utils/theme";
import {Navigate, Outlet, Route, Routes, useLocation} from "react-router-dom";
import {LoginContainer} from "./pages/user/login";
import {JoinContainer} from "./pages/user/join";
import {Main} from "./pages/main";
import {MainMapSearch} from "./components/main/mainMapSearch";
import {TestModal} from "./pages/testModal";
import {UserInfo} from "./components/user/user.info";
import {ViewPost} from "./pages/post/viewPost";
import {BoardAll} from "./pages/board/boardAll";
import {verify} from "./utils/util";
import Logout from "./pages/user/logout";


function App() {
    // 추후 다크모드, 라이트 모드등 지원을 위해
  const [myTheme, setTheme] = useState(defaultTheme);
    const location = useLocation();
    // const background = location.state && location.state.background;
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
                    <Route path={"post"} element={<ViewPost />} />
                    <Route path={"board/list"} element={<BoardAll />} />
                </Route>
            </Route>
        </Routes>
    </ThemeProvider>
  );
}

export default App;
