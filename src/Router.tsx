import { BrowserRouter, Routes, Route } from "react-router-dom";
import Coins from "./routes/Coins";
import Coin from "./routes/Coin";
import Price from "./routes/Price";
import Chart from "./routes/Chart";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Coins />} />
                <Route path="/:coinId" element={<Coin />}>
                    {/* 💡 Nested Router : 현재 페이지를 보이지만 경로에 따라 다른 것을 추가로 띄워줌 */}
                    <Route path={`price`} element={<Price />} />
                    <Route path={`chart`} element={<Chart />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
export default Router;
