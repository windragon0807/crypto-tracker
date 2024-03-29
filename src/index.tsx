import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { RecoilRoot } from "recoil";

// 💡 react-query는 React v17까지만 지원이 되므로, v18부터 호환되는 @tanstack/react-query 사용
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <RecoilRoot>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </RecoilRoot>
);
