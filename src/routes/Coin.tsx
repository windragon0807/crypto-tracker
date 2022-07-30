import { useQuery } from "@tanstack/react-query";
import { useLocation, useMatch, Outlet } from "react-router";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet";

interface RouteParams {
    coinId: string;
}

interface RouteState {
    state: {
        name: string;
    };
}

// API 데이터 타입
interface InfoData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
    description: string;
    message: string;
    open_source: boolean;
    started_at: string;
    development_status: string;
    hardware_wallet: boolean;
    proof_type: string;
    org_structure: string;
    hash_algorithm: string;
    first_data_at: string;
    last_data_at: string;
}

interface PriceData {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    beta_value: number;
    first_data_at: string;
    last_updated: string;
    quotes: {
        USD: {
            ath_date: string;
            ath_price: number;
            market_cap: number;
            market_cap_change_24h: number;
            percent_change_1h: number;
            percent_change_1y: number;
            percent_change_6h: number;
            percent_change_7d: number;
            percent_change_12h: number;
            percent_change_15m: number;
            percent_change_24h: number;
            percent_change_30d: number;
            percent_change_30m: number;
            percent_from_price_ath: number;
            price: number;
            volume_24h: number;
            volume_24h_change_24h: number;
        };
    };
}

const Coin = () => {
    // 💡 URL로 전달되는 변수 받아오기
    const { coinId } = useParams<keyof RouteParams>() as RouteParams;
    // 💡 Route state로 오는 데이터 받기
    const { state } = useLocation() as RouteState;
    // 💡 useMatch : 현재 위치를 기준으로 지정된 경로에 대한 일치 데이터를 반환합니다.
    const priceMatch = useMatch("/:coinId/price");
    const chartMatch = useMatch("/:coinId/chart");
    // 💡 두 개의 useQuery로 인해 isLoading, data 변수명이 같은 것을 방지하기 위해 변수명을 따로 지정해주는 방법
    // 📒 @tanstack/react-query 사용하기 전 불편함을 감수한 코드
    const { isLoading: infoLoading, data: infoData } = useQuery<InfoData>(["info", coinId], () =>
        fetchCoinInfo(coinId)
    );
    const { isLoading: tickersLoading, data: tickersData } = useQuery<PriceData>(
        ["tickers", coinId],
        // 💡 argument가 있는 함수를 사용하려면 () => 을 써 줘야 하고, argument가 없으면 함수 이름만 써 주면 된다.
        () => fetchCoinTickers(coinId),
        {
            refetchInterval: 5000,
        }
    );
    const loading = infoLoading || tickersLoading;

    return (
        <Container>
            <Helmet>
                <title>{state?.name ? state.name : loading ? "Loading..." : infoData?.name}</title>
            </Helmet>
            <Header>
                <Title>
                    <Link to="/">
                        {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
                    </Link>
                </Title>
            </Header>
            {loading ? (
                <Loader>Loading...</Loader>
            ) : (
                <>
                    <Overview>
                        <OverviewItem>
                            <span>Rank</span>
                            <span>{infoData?.rank}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Symbol</span>
                            <span>${infoData?.symbol}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Price</span>
                            {/* prettier-ignore */}
                            <span>
                                {/* 💡 숫자 콤마 찍어주기 방법 1 */}
                                ${tickersData?.quotes?.USD?.price?.toFixed(3)
                                    .toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                            </span>
                        </OverviewItem>
                    </Overview>
                    <Description>{infoData?.description}</Description>
                    <Overview>
                        <OverviewItem>
                            <span>Total Suply</span>
                            {/* 💡 숫자 콤마 찍어주기 방법 2 */}
                            <span>{tickersData?.total_supply.toLocaleString("ko-KR")}</span>
                        </OverviewItem>
                        <OverviewItem>
                            <span>Max Supply</span>
                            <span>{tickersData?.max_supply.toLocaleString("ko-KR")}</span>
                        </OverviewItem>
                    </Overview>
                    <Tabs>
                        <Tab isActive={chartMatch !== null}>
                            <Link to={`/${coinId}/chart`}>Chart</Link>
                        </Tab>
                        <Tab isActive={priceMatch !== null}>
                            <Link to={`/${coinId}/price`}>Price</Link>
                        </Tab>
                    </Tabs>
                    {/* 💡 Outlet : Nested Router를 사용하기 위함 */}
                    {/* 💡 context : 해당 Nexted Router에 파라미터 전달 */}
                    <Outlet context={{ coinId }} />
                </>
            )}
        </Container>
    );
};

const Container = styled.div`
    padding: 0px 20px;
    max-width: 480px;
    margin: 0 auto;
`;

const Header = styled.header`
    height: 15vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Title = styled.h1`
    font-size: 48px;
    color: ${(props) => props.theme.accentColor};
    font-weight: 500;
`;

const Loader = styled.span`
    text-align: center;
    display: block;
`;

const Overview = styled.div`
    display: flex;
    justify-content: space-between;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 10px 20px;
    border-radius: 10px;
`;

const OverviewItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33%;
    letter-spacing: 0.5px;
    color: white;
    span:first-child {
        font-size: 10px;
        font-weight: 400;
        text-transform: uppercase;
        margin-bottom: 5px;
    }
`;

const Description = styled.p`
    font-size: 20px;
    font-weight: 400;
    margin: 20px 10px;
`;

const Tabs = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    margin: 25px 0px;
    gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
    text-align: center;
    text-transform: uppercase; // 💡
    font-size: 12px;
    font-weight: 400;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 7px 0px;
    border-radius: 10px;
    color: ${(props) => (props.isActive ? props.theme.accentColor : "white")};
    &:hover {
        color: ${(props) => props.theme.chartStart};
    }
    a {
        padding: 7px 0px;
        display: block;
    }
`;

export default Coin;

/* 📒 @tanstack/react-query 사용하기 전 불편함을 감수한 코드
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState<InfoData>();
    const [priceInfo, setPriceInfo] = useState<PriceData>();
    useEffect(() => {
        (async () => {
            // 💡 두 줄의 await 문을 한 줄로 캡슐화
            const infoData = await (
                await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
            ).json();
            const priceData = await (
                await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
            ).json();
            setInfo(infoData);
            setPriceInfo(priceData);
            setLoading(false);
        })();
    }, [coinId]);
*/
