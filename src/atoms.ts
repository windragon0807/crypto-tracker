import { atom } from "recoil";

// ๐ก redux์ "state"์ ๋์ผํ๋ค.
export const isDarkAtom = atom({
    key: "isDark",
    default: true,
});
