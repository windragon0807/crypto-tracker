// import original module declarations
import "styled-components";

// 💡 styled componenets의 테마 정의 확장
declare module "styled-components" {
    export interface DefaultTheme {
        textColor: string;
        bgColor: string;
        btnbgColor: string;
        btnColor: string;
        accentColor: string;
        chartStart: string;
        chartEnd: string;
        cardBgColor: string;
    }
}
