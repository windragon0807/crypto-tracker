import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { useTheme } from "styled-components";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "../atoms";

interface IHistorical {
    time_open: string;
    time_close: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    market_cap: number;
}

interface ChartProps {
    coinId: string;
}

const Chart = () => {
    const theme = useTheme();
    // ๐ก atom state๋ฅผ ๋ฐ์์ค๊ธฐ
    const isDark = useRecoilValue(isDarkAtom);
    // ๐ก <Outlet context={} /> ๋ฅผ ํตํด์ ๋ฐ์ ํ๋ผ๋ฏธํฐ ๋ถ๋ฌ์ค๋ Hook
    const { coinId } = useOutletContext<ChartProps>();
    console.log(coinId);
    // ๐ก data๋ fethcing ํ ํ ๋น๋๋ฏ๋ก, useQuery ๋ฐ์์ console.log๋ฅผ ๋์์ ํ์ธํ  ๊ฒฝ์ฐ, undefined๊ฐ ๋์จ๋ค.
    const { isLoading, data } = useQuery<IHistorical[]>(
        ["ohlcv", coinId],
        () => fetchCoinHistory(coinId),
        // ๐ก refetch ๊ฐ๊ฒฉ
        {
            refetchInterval: 10000,
        }
    );

    return (
        <div>
            {isLoading ? (
                "Loading chart..."
            ) : (
                // ๐ก ApexChart ์ฌ์ฉ๋ฒ https://apexcharts.com/docs/installation/ or DEMOS
                <ApexChart
                    type="line"
                    series={[
                        {
                            name: "Price",
                            data: data?.map((price) => price.close) ?? [],
                        },
                    ]}
                    options={{
                        theme: {
                            mode: isDark ? "dark" : "light",
                        },
                        chart: {
                            height: 300,
                            width: 500,
                            toolbar: {
                                show: false,
                            },
                            background: "transparent",
                        },
                        grid: { show: false },
                        stroke: {
                            curve: "smooth",
                            width: 4,
                        },
                        yaxis: {
                            show: false,
                        },
                        xaxis: {
                            axisBorder: { show: false },
                            axisTicks: { show: false },
                            labels: {
                                show: false,
                                datetimeFormatter: {
                                    month: "MMM 'yy",
                                },
                            },
                            type: "datetime",
                            categories: data?.map((price) => price.time_close),
                        },
                        fill: {
                            type: "gradient",
                            gradient: { gradientToColors: [theme.chartStart], stops: [0, 100] },
                        },
                        colors: [theme.chartEnd],
                        tooltip: {
                            y: {
                                formatter: (value) => `$${value.toFixed(2)}`,
                            },
                        },
                    }}
                />
            )}
        </div>
    );
};

export default Chart;
