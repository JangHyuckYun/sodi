import {atom} from "recoil";
import {v1} from "uuid";
import {messages} from "../utils/message";

let type = navigator.appName;
console.log('type', type)
let lang = type === "Netscape" ? navigator.language : navigator.userLanguage;
let code = lang.includes("-") ? lang.split("-")[1].toUpperCase() : lang.toUpperCase();
// TODO 모든 국가 되도록 설정
code = code !== "KR" ? "EN" : code;

export const queryKeywordState = atom({
    key: `queryKeywordState/${v1()}`,
    default: '',
});

export const countrycodeState = atom({
    key: `userCountryCodeState/${v1()}`,
    default: code,
});

export const messageState = atom({
    key: `defaultMessageState/${v1()}`,
    default: messages[code],
});
