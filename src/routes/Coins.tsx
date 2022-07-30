import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { Helmet } from "react-helmet";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

// 💡 API로부터 오는 데이터의 형식을 미리 지정
// 💡 인터페이스를 지칭하는 변수명 앞에 대문자 I
interface ICoin {
    id: string;
    name: string;
    symbol: string;
    rank: number;
    is_new: boolean;
    is_active: boolean;
    type: string;
}

const Coins = () => {
    const isDark = useRecoilValue(isDarkAtom);
    // 💡 atom state 값을 변경하기 위한 set 함수 만들기
    const setDarkAtom = useSetRecoilState(isDarkAtom);
    // 💡 atom state 값을 반대 boolean 값으로 바꾸기
    const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
    // 📒 @tanstack/react-query 사용하기 전 불편함을 감수한 코드
    const { isLoading, data } = useQuery<ICoin[]>(["allCoins"], fetchCoins);
    // 💡 para1 : query 고유 식별자 / para2 : fetcher Function
    return (
        <Container>
            {/* 💡 해당 컴포넌트에서 변경된 HTML 요소들을 직접 연결해준다. */}
            <Helmet>
                <title>Coins</title>
            </Helmet>
            <Header>
                <Title>Coins</Title>
                <ThemeButton onClick={toggleDarkAtom}>
                    {isDark ? "Light Mode" : "Dark Mode"}
                </ThemeButton>
            </Header>
            {isLoading ? (
                <Loader>Loading...</Loader>
            ) : (
                <CoinsList>
                    {/* 💡 map 사용 시 return 없이 ()를 사용할 수 있다. */}
                    {data?.slice(0, 50).map((coin) => (
                        <Coin key={coin.id}>
                            {/* 💡 Link to : 라우트 경로, state : 전달할 데이터 */}
                            <Link to={`/${coin.id}`} state={coin}>
                                <Img
                                    src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                                />
                                {/* 💡 &rarr; : 화살표 그리기 */}
                                {coin.name}
                            </Link>
                        </Coin>
                    ))}
                </CoinsList>
            )}
        </Container>
    );
};

const Container = styled.div`
    padding: 0px 20px;
    max-width: 480px;
    margin: 0 auto; // 💡 화면이 넓어져도 가운데 정렬
`;

const Header = styled.header`
    height: 15vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 30px 0px;
`;

const Title = styled.h1`
    font-size: 48px;
    color: ${(props) => props.theme.accentColor};
    font-weight: 500;
    margin-bottom: 20px;
`;

const ThemeButton = styled.button`
    padding: 15px;
    background-color: ${(props) => props.theme.btnbgColor};
    border: none;
    border-radius: 40px;
    color: ${(props) => props.theme.btnColor};
    font-size: 16px;
    font-weight: 600;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
    background-color: ${(props) => props.theme.cardBgColor};
    color: ${(props) => props.theme.textColor};
    border-radius: 15px;
    margin-bottom: 10px;
    border: 1px solid white;
    a {
        // 💡 Link css 효과 부여
        padding: 20px;
        transition: color 0.2s ease-in; // 💡 hover 효과 transition
        /* display: block; // 💡 링크 영역 확장 */
        display: flex;
        align-items: center;
        font-weight: 500;
    }
    &:hover {
        a {
            color: ${(props) => props.theme.accentColor};
        }
    }
`;

const Loader = styled.span`
    text-align: center;
    display: block;
`;

const Img = styled.img`
    width: 35px;
    height: 35px;
    margin-right: 15px;
`;

export default Coins;

/* 📒 @tanstack/react-query 사용하기 전 불편함을 감수한 코드
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // 💡 즉시 실행 함수
        (async () => {
            const response = await fetch("https://api.coinpaprika.com/v1/coins");
            const json = await response.json();
            setCoins(json.slice(0, 100)); // 💡 배열 자르기
            setLoading(false);
        })();
    }, []); // 💡 시작할 때만 실행
*/
