import { observable } from "mobx";
import { sodiApi } from "../utils/api";

const mainSearchStore = observable({
  // state
  viewData: [],
  searchList: [],
  acSearchResults: [],
  acSearchKeyword: "",
  acSearchKeywordOnlyTxt: false,
  isClick: false,
  originalCountryInfo: {

  },
  //action
  async updateSearchList(searchKeyword) {
    // this.queryKeyword = searchKeyword;
    let data = await sodiApi.map
      .searchResultList(searchKeyword)
      .then((d) => d)
      .catch((err) => {
        console.log("err");
        return {
          features: [],
          query: [],
          type: "error",
          attribution: "",
        };
      });
    this.viewData = data;

    this.searchList = data?.features ?? [];
  },
});

// 상태 바뀔 때마다
// autorun(() => console.log('changed'))

export default mainSearchStore;
