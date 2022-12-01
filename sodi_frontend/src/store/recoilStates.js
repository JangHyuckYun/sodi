import {atom} from "recoil";
import {v1} from "uuid";

export const queryKeywordState = atom({
    key: `queryKeywordState/${v1()}`,
    default: '',
});
