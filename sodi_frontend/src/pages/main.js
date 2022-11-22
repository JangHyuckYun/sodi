import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  Suspense,
} from "react";

import {
  GeolocateControl,
  Layer,
  Map,
  Marker,
  Source,
  useMap,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { GeoJsonLayer, DeckGL } from "deck.gl";
import styled from "styled-components";
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { publicKey, sodiApi } from "../utils/api";
import { useQuery } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import { MainMapSearch } from "../components/main/mainMapSearch";
import {MdPostAdd} from "react-icons/md";
import ImageUploading from 'react-images-uploading';
// import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
// import Geocoder from 'react-map-gl-geocoder/src';
// import 'maplibre-gl/dist/maplibre-gl.css';

const transformRequest = (url, resourceType) => {
  if (resourceType === "Tile" && url.match("localhost")) {
    return {
      url: url,
      headers: { Authorization: "Bearer " + publicKey },
    };
  }
};

const FlexContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const MapContainer = styled.div`
  position: relative;
  flex: 0.75;

  & canvas {
    width: 100%;
    height: 100%;
  }
`;

const AddPostModal = ({ addPostModalData, open, handleClose, handleOpen }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const { coordinates, bbox, id, place_name, text, type } = addPostModalData;
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [country, setCountry] = React.useState(place_name);
  const [images, setImages] = React.useState([]);
  const maxNumber = 5;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const uploadPost = useCallback(async () => {
    console.log(title, content, country, images)
    if ([title, country].some(str => (str?.trim() || "").length === 0)) return alert("제목 또는 도시의 값을 입력해주세요.");

    await sodiApi.board.uploadPost({ title, content, country, images });
  }, [title, content, country, images]);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        data-id={id}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Post Modal
          </Typography>
          <Box id="modal-modal-description" className={"countryBox"}>
            <Box sx={{ display:"flex", alignItems:'center' }}>
              <Typography id="modal-modal-title" variant="p" component="p" sx={{ mr:2, flex:0.15 }}>
                Title
              </Typography>
              <TextField
                  sx={{ flex:0.85 }}
                  fullWidth
                  id="outlined-basic"
                  label=""
                  variant="outlined"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
              />
            </Box>
          </Box>

          <Box id="modal-modal-description" className={"contentBox"}>
            <Box sx={{ display:"flex", alignItems:'center' }}>
              <Typography id="modal-modal-title" variant="p" component="p" sx={{ mr:2, flex:0.15 }}>
                Content
              </Typography>
              <TextField
                  sx={{ flex:0.85 }}
                  fullWidth
                  id="outlined-basic"
                  label=""
                  variant="outlined"
                  multiline
                  rows={6}
                  maxRows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
              />
            </Box>
          </Box>

          <Box id="modal-modal-description" className={"countryBox"}>
            <Box sx={{ display:"flex", alignItems:'center' }}>
              <Typography id="modal-modal-title" variant="p" component="p" sx={{ mr:2, flex:0.15 }}>
                Country
              </Typography>
              <TextField
                  sx={{ flex:0.85 }}
                  fullWidth
                  id="outlined-basic"
                  label=""
                  variant="outlined"
                  defaultValue={place_name}
                  readOnly={false}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
              />
            </Box>
          </Box>

          <Box id="modal-modal-description" className={"countryBox"}>
            <Box sx={{ display:"flex", alignItems:'center' }}>
              <Typography id="modal-modal-title" variant="p" component="p" sx={{ mr:2, flex:0.15 }}>
                Images
              </Typography>
              <TextField
                  sx={{ flex:0.85 }}
                  fullWidth
                  id="outlined-basic"
                  label=""
                  variant="outlined"
                  defaultValue={place_name}
              />
            </Box>
            <ImageUploading
                multiple
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
            >
              {({
                  imageList,
                  onImageUpload,
                  onImageRemoveAll,
                  onImageUpdate,
                  onImageRemove,
                  isDragging,
                  dragProps,
                }) => (
                  // write your building UI
                  <div className="upload__image-wrapper">
                    <button
                        style={isDragging ? { color: 'red' } : undefined}
                        onClick={onImageUpload}
                        {...dragProps}
                    >
                      Click or Drop here
                    </button>
                    &nbsp;
                    <button onClick={onImageRemoveAll}>Remove all images</button>
                    {imageList.map((image, index) => (
                        <div key={index} className="image-item">
                          <img src={image['data_url']} alt="" width="100" />
                          <div className="image-item__btn-wrapper">
                            <button onClick={() => onImageUpdate(index)}>Update</button>
                            <button onClick={() => onImageRemove(index)}>Remove</button>
                          </div>
                        </div>
                    ))}
                  </div>
              )}
            </ImageUploading>
          </Box>
          <Box id={"modal-modal-description"}>
            <Button onClick={() => uploadPost()}>Upload Post</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

const AddPostButton = styled(Button)`
  position: absolute !important;
  left: 27%;
  background: #6a8fbc;
  z-index: 99;
  
  & svg {
    font-size: 32px;
  }
`;

export const Main = () => {
  // return <Map mapLib={maplibregl} />;
  // 원하는 포크 사용 시 사용
  const initialAddPostModalData = {
    coordinates: [],
    bbox: [],
    id: "",
    place_name: "",
    text: "",
    type: "",
  };
  const [viewState, setViewState] = React.useState({
    longitude: 0,
    latitude: 0,
    zoom: 3.5,
    transitionDuration: 100,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [queryKeyword, setQueryKeyword] = useState("");
  const [addPostModalData, setAddPostModalData] = useState(initialAddPostModalData);
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(({ coordinates, bbox, id, place_name, text, type }) => {
    setAddPostModalData({ coordinates, bbox, id, place_name, text, type });
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    console.log("close");
    setOpen(false);
  }, []);

  const geolocateControlRef = React.useCallback((ref) => {
    if (ref) {
      // Activate as soon as the control is loaded
      ref.trigger();
      console.log("safasfsaf");
    }
  }, []);

  const mapRef = useRef();
  const map = useMap();

  useEffect(() => {
    /*
     * searchType
     *  - place
     *  - postcode
     *  - address
     *  - country
     *  - region
     *  - district
     *  - locality
     *  - neighborhood
     *  - poi
     *
     * search Optional parameters
     *  - ip
     *  - coordinate
     *  - none
     *
     *
     * */
    (async () => {
      // let data = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/can.json?proximity=ip&types=place%2Cpostcode%2Caddress&access_token=${publicKey}`).then(result => result.json());
      // console.log(data)
    })();
  }, []);

  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 7,
      "circle-color": "#007cbf",
    },
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      return setQueryKeyword(searchKeyword);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchKeyword]);

  const onChangeBySearch = ({ target: { value } }) => {
    setSearchKeyword(value);
  };

  let { data } = useQuery(
    ["searchResultList", queryKeyword],
    () => sodiApi.map.searchResultList(queryKeyword),
    {
      enabled: !!queryKeyword,
      cacheTime: 6 * 10 * 1000,
    }
  );

  const goTothePlace = useCallback(
    ({
      target: {
        dataset: { id },
      },
    }) => {
      let findIndex = data?.features?.findIndex((d) => d.id === id);
      if (findIndex > -1) {
        let [left, top] = data.features[findIndex].center;
        setViewState({
          zoom: 10,
          longitude: left,
          latitude: top,
        });
      }
    },
    [data]
  );

  return (
    <ErrorBoundary
      fallback={
        <div>
          <h1>error...</h1>
        </div>
      }
    >
      <AddPostModal
        addPostModalData={addPostModalData}
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
      />
      <AddPostButton color={"primary"} onClick={() => handleOpen(initialAddPostModalData)}>
        <MdPostAdd />
      </AddPostButton>
      <FlexContainer>
        <MainMapSearch
          searchList={data?.features}
          goTothePlace={goTothePlace}
          searchKeyword={searchKeyword}
          onChangeBySearch={onChangeBySearch}
          viewAddPostModal={handleOpen}
        />
        <MapContainer>
          <Map
            ref={mapRef}
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            onClick={(evt) => console.log(evt)}
            onViewPortChange={setViewState}
            mapboxAccessToken={publicKey}
            // style={{ width: window.innerWidth, height: window.innerHeight }}
            mapStyle="mapbox://styles/janghyuck/claib2r2b000115nv6hdl2oct"
          >
            <GeolocateControl ref={mapRef} />

            <Suspense fallback={<h1>Loading... </h1>}>
              <Source id={"my-Data"} type={"geojson"} data={data}>
                <Layer {...layerStyle} />
              </Source>
            </Suspense>

            <Marker
              longitude={-100}
              latitude={40}
              anchor={"bottom"}
              onClick={(e) => console.log("asfsaf")}
            />
          </Map>
        </MapContainer>
      </FlexContainer>
    </ErrorBoundary>
  );
};
