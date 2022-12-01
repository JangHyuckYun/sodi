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
  Popup,
  Source,
  useMap,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { GeoJsonLayer, DeckGL } from "deck.gl";
import styled from "styled-components";
import {
  Box,
  Button,
  ButtonGroup,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { publicKey, sodiApi } from "../utils/api";
import { useQuery } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import { MainMapSearch } from "../components/main/mainMapSearch";
import { MdPostAdd } from "react-icons/md";
import ImageUploading from "react-images-uploading";
import { encode } from "base64-arraybuffer";
import { Link, Outlet } from "react-router-dom";
import { AddPostModal } from "../modal/addPostModal";
import { ViewPostModal } from "../modal/viewPostModal";
import { atom, useRecoilValue } from "recoil";
import { queryKeywordState } from "../store/recoilStates";
import { queryKeywordSelector } from "../store/recoilSelector";
// import 'maplibre-gl/dist/maplibre-gl.css';

/* TODO
 *  - GO TO THE PLACE 클릭 시 이동 효과 자연스럽게
 *  - 유저가 생성한 위치 useQuery시 최적화 ( 지도 렌더링시마다 가져와짐 )
 * */
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

const AddPostButton = styled(Button)`
  position: absolute !important;
  left: 27%;
  background: #6a8fbc;
  z-index: 99;

  & svg {
    font-size: 32px;
  }
`;

const PreviewPopup = styled(Popup)`
  width: 100%;
  .mapboxgl-popup-content {
    h6 {
      margin-bottom: 5px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      font-weight: bold;
    }

    p {
      margin: 0 0 20px 0;
    }

    .btn-group {
      width: 100%;
      display: flex;
      justify-content: right;
      margin-top: 30px;
      padding-top: 5px;
      border-top: 1px solid rgba(0, 0, 0, 0.1);

      button {
      }
    }
    .mapboxgl-popup-close-button {
      width: 26px;
      height: 22px;
      font-size: 22px;
    }
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
    longitude: 127.03743678547232,
    latitude: 37.52019604873446,
    zoom: 6,
    transitionDuration: 100,
  });

  const [addPostModalData, setAddPostModalData] = useState(
    initialAddPostModalData
  );
  const [open, setOpen] = useState(false);

  // const [usersAllDataList, setUsersAllDataList] = useState([]);
  const usersAllDataList_query = useQuery(["userAllDataList"], () =>
    sodiApi.board.findAll()
  );

  const [popupInfo, setPopupInfo] = useState(null);

  const handleOpen = useCallback(
    ({ coordinates, bbox, id, place_name, text, type }) => {
      setAddPostModalData({ coordinates, bbox, id, place_name, text, type });
      setOpen(true);
    },
    []
  );
  const [viewPostOpen, setViewPostOpen] = useState(false);
  const [viewPostModalData, setViewPostModalData] = useState(false);
  const viewPostHandleOpen = useCallback(
    ({ coordinates, bbox, id, place_name, text, type }) => {
      setViewPostModalData({ coordinates, bbox, id, place_name, text, type });
      setViewPostOpen(true);
    },
    []
  );

  const handleClose = useCallback(() => {
    console.log("close");
    setOpen(false);
  }, []);

  const viewPostHandleClose = useCallback(() => {
    console.log("close");
    setViewPostOpen(false);
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

  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 7,
      "circle-color": "#007cbf",
    },
  };

  const queryKeyword = useRecoilValue(queryKeywordState);

  let { data, response } = useQuery(
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
        handleClose={handleClose}
      />
      <ViewPostModal
        viewPostModalData={viewPostModalData}
        open={viewPostOpen}
        handleClose={viewPostHandleClose}
      />
      {/*<Link style={{ position:'absolute', zIndex:1111 }} to={"/main/modal/1"}>GOGOGO</Link>*/}
      <AddPostButton
        color={"primary"}
        onClick={() => handleOpen(initialAddPostModalData)}
      >
        <MdPostAdd />
      </AddPostButton>
      <FlexContainer>
        <MainMapSearch
          searchList={data?.features}
          goTothePlace={goTothePlace}
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

            {!usersAllDataList_query.isSuccess
              ? ""
              : usersAllDataList_query.data.data.map((post) => (
                  <Marker
                    key={post.id}
                    data-id={post.id}
                    longitude={post.longitude}
                    latitude={post.latitude}
                    onClick={(e) => {
                      e.originalEvent.stopPropagation();
                      console.log("click", post.title, post.content);
                      setPopupInfo(post);
                    }}
                  />
                ))}

            {popupInfo && (
              <PreviewPopup
                anchor="top"
                longitude={Number(popupInfo.longitude)}
                latitude={Number(popupInfo.latitude)}
                onClose={() => setPopupInfo(null)}
              >
                <Typography
                  id="modal-description"
                  variant={"h6"}
                  sx={{ whiteSpace: "pre-line", mt: 2, mb: 1 }}
                >
                  {popupInfo.title}
                </Typography>
                <Typography
                  id="modal-description"
                  sx={{ whiteSpace: "pre-line" }}
                >
                  {popupInfo.content}
                </Typography>
                <Box className={"btn-group"}>
                  <Button
                    size={"small"}
                    onClick={(e) => {
                      setViewPostModalData(popupInfo);
                      setViewPostOpen(true);
                    }}
                  >
                    Read more
                  </Button>
                </Box>
              </PreviewPopup>
            )}
          </Map>
        </MapContainer>
      </FlexContainer>
    </ErrorBoundary>
  );
};
