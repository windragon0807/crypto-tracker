import { atom } from "recoil";

// 💡 redux의 "state"와 동일하다.
export const isDarkAtom = atom({
    key: "isDark",
    default: true,
});
