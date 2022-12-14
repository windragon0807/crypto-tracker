import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { Helmet } from "react-helmet";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isDarkAtom } from "../atoms";

// π‘ APIλ‘λΆν° μ€λ λ°μ΄ν°μ νμμ λ―Έλ¦¬ μ§μ 
// π‘ μΈν°νμ΄μ€λ₯Ό μ§μΉ­νλ λ³μλͺ μμ λλ¬Έμ I
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
    // π‘ atom state κ°μ λ³κ²½νκΈ° μν set ν¨μ λ§λ€κΈ°
    const setDarkAtom = useSetRecoilState(isDarkAtom);
    // π‘ atom state κ°μ λ°λ boolean κ°μΌλ‘ λ°κΎΈκΈ°
    const toggleDarkAtom = () => setDarkAtom((prev) => !prev);
    // π @tanstack/react-query μ¬μ©νκΈ° μ  λΆνΈν¨μ κ°μν μ½λ
    const { isLoading, data } = useQuery<ICoin[]>(["allCoins"], fetchCoins);
    // π‘ para1 : query κ³ μ  μλ³μ / para2 : fetcher Function
    return (
        <Container>
            {/* π‘ ν΄λΉ μ»΄ν¬λνΈμμ λ³κ²½λ HTML μμλ€μ μ§μ  μ°κ²°ν΄μ€λ€. */}
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
                    {/* π‘ map μ¬μ© μ return μμ΄ ()λ₯Ό μ¬μ©ν  μ μλ€. */}
                    {data?.slice(0, 50).map((coin) => (
                        <Coin key={coin.id}>
                            {/* π‘ Link to : λΌμ°νΈ κ²½λ‘, state : μ λ¬ν  λ°μ΄ν° */}
                            <Link to={`/${coin.id}`} state={coin}>
                                <Img
                                    src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
                                />
                                {/* π‘ &rarr; : νμ΄ν κ·Έλ¦¬κΈ° */}
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
    margin: 0 auto; // π‘ νλ©΄μ΄ λμ΄μ Έλ κ°μ΄λ° μ λ ¬
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
        // π‘ Link css ν¨κ³Ό λΆμ¬
        padding: 20px;
        transition: color 0.2s ease-in; // π‘ hover ν¨κ³Ό transition
        /* display: block; // π‘ λ§ν¬ μμ­ νμ₯ */
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

/* π @tanstack/react-query μ¬μ©νκΈ° μ  λΆνΈν¨μ κ°μν μ½λ
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // π‘ μ¦μ μ€ν ν¨μ
        (async () => {
            const response = await fetch("https://api.coinpaprika.com/v1/coins");
            const json = await response.json();
            setCoins(json.slice(0, 100)); // π‘ λ°°μ΄ μλ₯΄κΈ°
            setLoading(false);
        })();
    }, []); // π‘ μμν  λλ§ μ€ν
*/
