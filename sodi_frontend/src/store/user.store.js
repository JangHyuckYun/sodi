import { observable } from "mobx";
import { sodiApi } from "../utils/api";

const isStringArray = (str) => /^\[[a-zA-Z0-9ㄱ-ㅎ가-힣_\"\,\.]+\]$/g.test(str);

const userStore = observable({
    // state
    user: {},
    boards: [],
    //action
    async setUser() {
        this.user = await sodiApi.user.find();
        this.boards = (await sodiApi.user.findBoards())?.map(d => ({
            ...d,
            images: isStringArray(d.images) ? JSON.parse(d.images) : d.images
        }));
    }
});

// 상태 바뀔 때마다
// autorun(() => console.log('changed'))

export default userStore;
