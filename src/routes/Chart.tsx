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
    // 💡 atom state를 받아오기
    const isDark = useRecoilValue(isDarkAtom);
    // 💡 <Outlet context={} /> 를 통해서 받은 파라미터 불러오는 Hook
    const { coinId } = useOutletContext<ChartProps>();
    console.log(coinId);
    // 💡 data는 fethcing 후 할당되므로, useQuery 밖에서 console.log를 띄워서 확인할 경우, undefined가 나온다.
    const { isLoading, data } = useQuery<IHistorical[]>(
        ["ohlcv", coinId],
        () => fetchCoinHistory(coinId),
        // 💡 refetch 간격
        {
            refetchInterval: 10000,
        }
    );

    return (
        <div>
            {isLoading ? (
                "Loading chart..."
            ) : (
                // 💡 ApexChart 사용법 https://apexcharts.com/docs/installation/ or DEMOS
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
