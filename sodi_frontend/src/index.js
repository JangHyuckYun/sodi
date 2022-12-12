import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {QueryCache, QueryClient, QueryClientProvider} from "react-query";
import {RecoilRoot} from "recoil";
import toast from "react-hot-toast";
import {BrowserRouter as Router} from "react-router-dom";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.log("error", error);
      toast.error(error.message);
    },
  }),
  defaultOptions: {
    queries: {
      retry: 0,
      // useErrorBoundary: true,
      suspense: true,
    },
    mutations: {
      useErrorBoundary: (error) => error.response?.status >= 500,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        {/*<ReactQueryDevtools initialIsOpen={false} />*/}
        {/*<Suspense fallback={<div>Loading...</div>}>*/}
        <Router>
          <App />
        </Router>
        {/*</Suspense>*/}
      </QueryClientProvider>
    </RecoilRoot>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals`
// reportWebVitals();
