import axios from "axios";

const BASE_URL = `https://api.coinpaprika.com/v1`;
const TEMP_URL = `https://ohlcv-api.nomadcoders.workers.dev`;

export const fetchCoins = async () => {
    // 💡 axios를 사용하면 get 데이터를 자동으로 json()화 시켜준다.
    return await axios.get(`${BASE_URL}/coins`).then((response) => response.data);
};

export const fetchCoinInfo = async (coinId: string) => {
    return await axios.get(`${BASE_URL}/coins/${coinId}`).then((response) => response.data);
};

export const fetchCoinTickers = async (coinId: string) => {
    return await axios.get(`${BASE_URL}/tickers/${coinId}`).then((response) => response.data);
};

export const fetchCoinHistory = async (coinId: string) => {
    return await axios.get(`${TEMP_URL}/?coinId=${coinId}`).then((response) => response.data);
};
