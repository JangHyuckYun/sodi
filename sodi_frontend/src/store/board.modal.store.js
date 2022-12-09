import { observable } from "mobx";
import { useCallback } from "react";
import { sodiApi } from "../utils/api";

const boardModalStore = observable({
  open: false,
  board: {},
  comments: [],
  boardList: {
    original: [],
    refine: [],
  },

  async setBoard(board) {
    this.board = board;
    await sodiApi.board.updateHits(board.id);
  },

  async setBoardList() {
    let boardList = await sodiApi.board.findAll();
    let refineData = boardList.data.reduce((acc, data) => {
      let { country, originalCountryInfo, images } = data;
      data.images = JSON.parse(images);
      originalCountryInfo = JSON.parse(originalCountryInfo);
      if (originalCountryInfo.en_name.length > 0) {
        const { en_name } = originalCountryInfo;
        if (!acc[en_name]) acc[en_name] = [];

        acc[en_name].push(data);
      } else {
        if (country.includes(',')) {
          let str = country.split(',').at(-1);
          if (!acc[str]) acc[str] = [];

          acc[str].push(data);
        } else {
          if (!acc[country]) acc[country] = [];

          acc[country].push(data);
        }
      }

      return acc;
    }, {
      something: [],
    });

    this.boardList = {
      original: boardList.data ?? [],
      refine: refineData
    };
  },

  viewPostHandleClose() {
    this.open = false;
  },
});

export default boardModalStore;
