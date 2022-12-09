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
} from "react-map-gl";
import "../assets/css/mapbox-gl2.css";

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
import {
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
import { AddPostModal } from "../modal/addPostModal";
import { ViewPostModal } from "../modal/viewPostModal";
import toast from "react-hot-toast";
import {FaMap, FaMapMarked, FaPowerOff, FaSearch, FaUser} from "react-icons/fa";
import indexStore from "../store/indexStore";
import { useObserver } from "mobx-react";
import {useNavigate} from "react-router";
import countries50m from '../assets/json/countries-50m.json';
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
  //min-width: 25%;
  //width: auto;
  transition: .22s ease-in;
  //height: calc(100% - 20px);
  height: 100%;
  max-height: calc(100% - 20px);
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
  padding: 15px;
  border-radius: 12px;
  left: 55px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 1;
  //max-height: 0;
  //transform: translateY(-50%);

  ${({ lastPathname }) => css`
      ${lastPathname === "" && css`
        width:0;
        height: 0;
        min-height: 50%;
        min-width: 0;
        padding: 0;
        opacity: 0;
      `}
  `}
  
  &.view_search {
    width: 25%;
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
  }
  
  &.view_user {
    width: 40%;
  }

  &.view_test {
    width: 25%;
  }

  &.view_post {
    width: 50%;
  }
  
  &.view_board_list {
    width: 50%;
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
  padding: 7px;
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
  height: 31px;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
  border-radius: 7px;
  transition: 0.2s;
  ${({ bg }) => css`
    background: ${bg};
  `}

  &.active {
    //transform: scale(1.1);
    box-shadow: 0 0 3px 4px rgba(0,0,0, .15);
    
    &:before {
      content: "";
      width: 3px;
      height: 31px;
      background: #5592f8;
      position: absolute;
      right: 0;
      transition: .2s;
    }
  }

  svg {
    color: white;
    padding-right: 1px;
    font-size: 14px;
  }
`;

// 126.86767, 37.500286
export const Main = () => {
  const location = useLocation();
  const { pathname } = location;
  const lastPathname = pathname.split("/main/map/")[1] ?? "";
  let { searchStore, boardStore, addModalStore } = indexStore();

  useEffect(() => {
    (async () => {
      let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/dongyang.json?limit=5&language=en&access_token=${publicKey}`;
      let data = await fetch(url)
        .then((e) => {
          // console.log("e", e);
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
  const [viewState, setViewState] = React.useState({
    longitude: 127.03743678547232,
    latitude: 37.52019604873446,
    zoom: 6,
    transitionDuration: 100,
  });

  const [popupInfo, setPopupInfo] = useState(null);

  // const [queryKeyword, setQueryKeyword] = useState("");
  const [viewPostOpen, setViewPostOpen] = useState(false);

  const usersAllDataList_query = useQuery(
    ["userAllDataList"],
    () => sodiApi.board.findAll(),
    {
      onError: (err) => (error) => toast.error("asfsfafas"),
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
  // const { current: map } = useMap();

  const goTothePlace = useCallback(
    ({
      target: {
        dataset: { id },
      },
    }) => {
      let findIndex = searchStore.searchList?.findIndex((d) => {
        return d.id === id;
      });
      if (findIndex > -1) {
        let [left, top] = searchStore.searchList[findIndex].center;

        setViewState({
          zoom: 10,
          longitude: left,
          latitude: top,
        });
      }
    },
    [searchStore.searchList]
  );

  const navigate = useNavigate();
  console.log("location", location);
  return useObserver(() => {
    return (
      <ErrorBoundary
        fallback={
          <div>
            <h1>error...</h1>
          </div>
        }
      >
        <MainNav>
          {/* to={pathname === "/main/map/search" ? "" : "search"} className={pathname === "/main/map/search" ? 'active' : ''} bg={"#fc5d5a"} */}
          <MainNavLink
              to={""}
              state={{ background: location }}
              className={lastPathname === "" ? 'active' : ''}
              bg={"#5592f8"}
          >
            <FaMap />
          </MainNavLink>
          <MainNavLink
            to={lastPathname === "search" ? "" : "search"}
            state={{ background: location }}
            className={lastPathname === "search" ? 'active' : ''}
            bg={"#790dfc"}
          >
            <FaSearch />
          </MainNavLink>
          <MainNavLink
            to={lastPathname === "user" ? "" : "user"}
            state={{ background: location }}
            className={lastPathname === "user" ? 'active' : ''}
            bg={"#fdb204"}
          >
            <FaUser />
          </MainNavLink>
          <MainNavLink
              to={lastPathname === "test" ? "" : "test"}
              state={{ background: location }}
              bg={"#14e0c4"}
          >
            <FaUser />
          </MainNavLink>

          <MainNavLink
              to={lastPathname === "board/list" ? "" : "board/list"}
              state={{ background: location }}
              className={lastPathname === "board/list" ? 'active' : ''}
              bg={"#ffc600"}
          >
            <FaMapMarked />
          </MainNavLink>

          <MainNavLink to={'logout'} bg={"#fd665e"}>
            <FaPowerOff />
          </MainNavLink>
        </MainNav>

        {/*{pathname !== "/main/map" && (*/}
          <SearchContainer
              lastPathname={lastPathname}
            className={"view_" + lastPathname?.replaceAll("/", "_")}
          >
            <Suspense fallback={<div>loading...</div>}>
              <Outlet
                context={
                  lastPathname === "search"
                    ? {
                        goTothePlace: goTothePlace,
                      }
                    : {}
                }
              />
            </Suspense>
          </SearchContainer>
        {/*)}*/}

        <AddPostModal />
        <ViewPostModal/>
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
            onMove={(evt) => {
              setViewState(evt.viewState);
            }}
            onClick={(evt) => {
              console.log('evt', evt)
              const { lng, lat } = evt.lngLat;
              searchStore.acSearchKeyword = `${lng},${lat}`;
              searchStore.acSearchKeywordOnlyTxt = false;
              searchStore.isClick = true;
              navigate('search');
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
              <Source
                id={"my-Data"}
                type={"geojson"}
                data={searchStore.viewData}
              >
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
                    onClick={async (e) => {

                      // setViewPostModalData(popupInfo);
                      // console.log("post", popupInfo);
                      // setViewPostOpen(true);
                      // boardModalStore.board = popupInfo;
                      // navigate(`post`)
                      boardStore.open = true;
                      await boardStore.setBoard(popupInfo);
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
  });
};
