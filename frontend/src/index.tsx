import React from "react";
import ReactDOM from "react-dom/client";
import "./app/layout/index.css";
import App from "./app/layout/App";
import reportWebVitals from "./reportWebVitals";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory, BrowserHistory } from "history";
import { StoreContext, StoreProvider } from "./app/Context/StoreContext";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
export const history: BrowserHistory = createBrowserHistory()!;
root.render(
  <React.StrictMode>
    <HistoryRouter history={history}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </HistoryRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
