import mainSearchStore from "./mainSearchStore";
import userStore from "./user.store";
import boardModalStore from "./board.modal.store";
import addModalStore from "./add.modal.store";

// store 모음
const indexStore = () => ({
    searchStore: mainSearchStore,
    userStore,
    boardStore: boardModalStore,
    addModalStore
});

export default indexStore;

