import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { RecoilRoot } from "recoil";

// ๐ก react-query๋ React v17๊น์ง๋ง ์ง์์ด ๋๋ฏ๋ก, v18๋ถํฐ ํธํ๋๋ @tanstack/react-query ์ฌ์ฉ
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <RecoilRoot>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </RecoilRoot>
);
