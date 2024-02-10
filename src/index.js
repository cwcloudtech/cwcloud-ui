import React from "react";
import ReactDOM from "react-dom";
import "./Themes/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-loading-skeleton/dist/skeleton.css";

const LightTheme = React.lazy(() => import('./Themes/Light/lightTheme'));
const DarkTheme = React.lazy(() => import('./Themes/Dark/darkTheme'));
const ThemeSelector = ({ children }) => {
    const checkMode = window.matchMedia("(prefers-color-scheme: light)");
    const system_mode = checkMode.matches ? 'light' : 'dark'
    const local_storage_mode = localStorage.getItem('modeComworkCloud')
    const _mode = local_storage_mode == null ? system_mode : local_storage_mode;
    return (
      <>
        <React.Suspense fallback={<></>}>
          {_mode === 'dark' && <DarkTheme />}
          {_mode === 'light' && <LightTheme />}
        </React.Suspense>
        {children}
      </>
    )
 }

ReactDOM.render(
    <ThemeSelector>
        <App />
    </ThemeSelector>,
    document.getElementById("root")
);

reportWebVitals();