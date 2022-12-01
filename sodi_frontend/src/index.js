import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RecoilRoot } from "recoil";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      // useErrorBoundary: true,
      suspense: true,
    },
    mutations: {
      useErrorBoundary: true,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        {/*<ReactQueryDevtools initialIsOpen={false} />*/}
        {/*<Suspense fallback={<div>Loading...</div>}>*/}
          <App />
        {/*</Suspense>*/}
      </QueryClientProvider>
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals`
// reportWebVitals();
