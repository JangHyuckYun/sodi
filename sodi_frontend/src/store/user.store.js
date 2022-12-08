import { observable } from "mobx";
import { sodiApi } from "../utils/api";

const userStore = observable({
    // state
    user: {},
    boards: [],
    //action
    async setUser() {
        this.user = await sodiApi.user.find();
        this.boards = (await sodiApi.user.findBoards())?.map(d => ({
            ...d,
            images: JSON.parse(d.images)
        }));
    }
});

// 상태 바뀔 때마다
// autorun(() => console.log('changed'))

export default userStore;
