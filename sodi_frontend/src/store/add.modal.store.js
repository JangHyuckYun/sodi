import {observable} from "mobx";

const addModalStore = observable({
  open: false,
  initialAddPostModalData: {
    coordinates: [],
    bbox: [],
    id: "",
    place_name: "",
    text: "",
    type: "",
  },
  addPostModalData: {
    coordinates: [0,0],
    bbox: [],
    id: "",
    place_name: "",
    text: "",
    type: "",
  },

  handleOpen({ coordinates, bbox, id, place_name, text, type }) {
    this.addPostModalData = { coordinates, bbox, id, place_name, text, type };
    this.open = true;
  },

  handleClose() {
    this.open = false;
  },
});
export default addModalStore;
