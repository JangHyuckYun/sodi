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
  NavigationControl,
  Popup,
  Source,
  useMap,
} from "react-map-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
import "../assets/css/mapbox-gl2.css";

import {
  AddressAutofill,
  SearchBox,
  AddressMinimap,
  useConfirmAddress,
} from "@mapbox/search-js-react";
import { GeoJsonLayer, DeckGL } from "deck.gl";
import styled, { css } from "styled-components";
import {
  Box,
  Button,
  ButtonGroup,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { publicKey, secretKey, sodiApi } from "../utils/api";
import { useQuery } from "react-query";
import { ErrorBoundary } from "react-error-boundary";
import { MainMapSearch } from "../components/main/mainMapSearch";
import { MdPostAdd } from "react-icons/md";
import ImageUploading from "react-images-uploading";
import { encode } from "base64-arraybuffer";
import { Link, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AddPostModal } from "../modal/addPostModal";
import { ViewPostModal } from "../modal/viewPostModal";
import { atom, useRecoilValue } from "recoil";
import { queryKeywordState } from "../store/recoilStates";
import { queryKeywordSelector } from "../store/recoilSelector";
import toast from "react-hot-toast";
import { ReactComponent as CustomMarker } from "../assets/images/customMarker.svg";
import { FaUser } from "react-icons/fa";
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

const SearchContainer = styled.div`
  //display: none;
  flex: 0.25;
  position: fixed;
  background: white;
  width: 25%;
  //height: calc(100% - 20px);
  height: 100%;
  max-height: calc(100% - 20px);
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
  padding: 15px;
  border-radius: 12px;
  left: 65px;
  top: 10px;
  //max-height: 0;
  //transform: translateY(-50%);

  .autoFillList {
    .autoFillListItem {
      transition: 0.2s;
      &.selected {
        background: rgba(0, 0, 0, 0.1);
        margin-left: 12px;
      }

      &:not(:last-child) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
    }
  }

  & .inputContainer {
    //margin-bottom: 35px;

    input {
      border-radius: 12px;
      height: 20px !important;
    }
  }

  & .searchResults {
    position: relative;
    max-height: 100%;
    overflow-y: auto;
    transition: 0.2s;

    & .searchResult {
      margin-bottom: 10px;
    }
  }
`;

const FlexContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;

  & canvas {
    width: 100%;
    height: 100%;
  }

  .mapboxgl-marker {
    .customMarker {
      .st1 {
        fill: url("#image");
      }
    }

    .markerMain {
      max-width: 50px;
    }

    .markerInImage {
      width: 50px;
    }
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

const MainNav = styled.nav`
  position: fixed;
  width: 45px;
  height: auto;
  min-height: 50%;
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 12px;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  z-index: 10;
`;

const MainNavLink = styled(Link)`
  display: flex;
  width: 100%;
  height: 25px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  border-radius: 7px;
  transition: 0.2s;
  ${({ bg }) => css`
    background: ${bg};
  `}

  &.active {
    transform: scale(1.17);
  }

  svg {
    color: white;
    padding-right: 1px;
    font-size: 14px;
  }
`;

// 126.86767, 37.500286
export const Main = () => {
  useEffect(() => {
    (async () => {
      let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/dongyang.json?limit=5&language=en&access_token=${publicKey}`;
      let data = await fetch(url)
        .then((e) => {
          console.log("e", e);
          return e.json();
        })
        .catch((e) => {
          console.log("error", e);
        });

      console.log("data", data);
    })();
  }, []);

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
  const [popupInfo, setPopupInfo] = useState(null);

  const [queryKeyword, setQueryKeyword] = useState("");
  const [viewPostOpen, setViewPostOpen] = useState(false);
  const [clickPos, setClickPos] = useState({ lng: 0, lat: 0 });

  const { pathname } = useLocation();

  console.log("pathname", pathname);

  const usersAllDataList_query = useQuery(
    ["userAllDataList"],
    () => sodiApi.board.findAll(),
    {
      onError: (err) => (error) => toast.error("asfsfafas"),
    }
  );
  let { data, response } = useQuery(
    ["searchResultList", queryKeyword],
    () => sodiApi.map.searchResultList(queryKeyword),
    {
      enabled: !!queryKeyword,
      cacheTime: 6 * 10 * 1000,
    }
  );

  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 7,
      "circle-color": "#007cbf",
    },
  };

  const handleOpen = useCallback(
    ({ coordinates, bbox, id, place_name, text, type }) => {
      setAddPostModalData({ coordinates, bbox, id, place_name, text, type });
      setOpen(true);
    },
    []
  );
  const [viewPostModalData, setViewPostModalData] = useState(false);
  const viewPostHandleOpen = useCallback(
    ({ coordinates, bbox, id, place_name, text, type, images }) => {
      setViewPostModalData({
        coordinates,
        bbox,
        id,
        place_name,
        text,
        type,
        images,
      });
      setViewPostOpen(true);
    },
    []
  );

  const handleClose = useCallback(() => {
    console.log("close");
    setOpen(false);
  }, []);

  const viewPostHandleClose = useCallback(() => {
    setViewPostOpen(false);
  }, []);

  const geolocateControlRef = React.useCallback((ref) => {
    if (ref) {
      // Activate as soon as the control is loaded
      ref.trigger();
    }
  }, []);

  const mapRef = useRef();
  const { current: map } = useMap();

  const goTothePlace = useCallback(
    ({
      target: {
        dataset: { id },
      },
    }) => {
      let findIndex = data?.features?.findIndex((d) => {
        return d.id === id;
      });
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
      <MainNav>
        <MainNavLink href={"/main/map/test"} bg={"#5592f8"} className={"active"}>
          <FaUser />
        </MainNavLink>

        <MainNavLink to={"/main/map/search"} bg={"#fc5d5a"}>
          <FaUser />
        </MainNavLink>
      </MainNav>

      {pathname !== "/main/map" && (
        <SearchContainer>
          <Outlet
            context={{
              mainSearch: {
                searchList: data?.features,
                goTothePlace: goTothePlace,
                viewAddPostModal: handleOpen,
                setQueryKeyword: setQueryKeyword,
                clickPos: clickPos,
              },
            }}
          />
        </SearchContainer>
      )}

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
      {/*<AddPostButton*/}
      {/*  color={"primary"}*/}
      {/*  onClick={() => handleOpen(initialAddPostModalData)}*/}
      {/*>*/}
      {/*  <MdPostAdd />*/}
      {/*</AddPostButton>*/}
      {/*<FlexContainer>*/}
      <MapContainer>
        <Map
          ref={mapRef}
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          onClick={(evt) => {
            console.log("asfsasfasaf", evt);
            setClickPos(evt.lngLat);
          }}
          onViewPortChange={setViewState}
          mapboxAccessToken={publicKey}
          // style={{ width: window.innerWidth, height: window.innerHeight }}
          // mapStyle="mapbox://styles/janghyuck/clbd6e5dl000d15nmhpjqkvzt"
          // mapStyle="mapbox://styles/janghyuck/clbd74ec2000c15qdxhrwc2qn"
          mapStyle="mapbox://styles/janghyuck/claib2r2b000115nv6hdl2oct"
          terrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
        >
          <GeolocateControl ref={mapRef} />
          <NavigationControl />

          <Suspense fallback={<h1>Loading... </h1>}>
            <Source id={"my-Data"} type={"geojson"} data={data}>
              <Layer {...layerStyle} />
            </Source>
          </Suspense>

          {!usersAllDataList_query
            ? ""
            : usersAllDataList_query.data.data.map((post) => (
                <Marker
                  key={post.id}
                  data-id={post.id}
                  longitude={post.longitude}
                  latitude={post.latitude}
                  className={"marker"}
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    post.images = JSON.parse(post.images);
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
                    console.log("post", popupInfo);
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
      {/*</FlexContainer>*/}
    </ErrorBoundary>
  );
};
