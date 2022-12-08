import mainSearchStore from "./mainSearchStore";
import userStore from "./user.store";

// store 모음
const indexStore = () => ({
    searchStore: mainSearchStore,
    userStore
});

export default indexStore;

