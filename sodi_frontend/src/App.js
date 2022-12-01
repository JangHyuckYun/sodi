import { useState } from "react";
import "./App.css";
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import defaultTheme, { darkTheme, lightTheme } from "./utils/theme";
import { BrowserRouter as Router, NavLink } from "react-router-dom";
import AnimatedRoutes from "./components/animatedRoutes";

function App() {
  const [myTheme, setTheme] = useState(defaultTheme);
  const [mode, setMode] = useState("light");

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
        }}
      />
      <CssBaseline enableColorScheme={true} />
      <Router>
        {/*<nav style={{ position: 'fixed', zIndex: 9999 }}>*/}
        {/*  <NavLink to="/" end>*/}
        {/*    Home*/}
        {/*  </NavLink>*/}
        {/*  <NavLink to="/user/login">About</NavLink>*/}
        {/*  <NavLink to="/user/join">Contact</NavLink>*/}
        {/*</nav>*/}
        <AnimatedRoutes />
      </Router>
    </ThemeProvider>
  );
}

export default App;
