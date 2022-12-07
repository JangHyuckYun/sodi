import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { queryKeywordState } from "../../store/recoilStates";
import { publicKey2, sodiApi } from "../../utils/api";
import { AddressAutofill } from "@mapbox/search-js-react";
import { useOutletContext } from "react-router";

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

const highlightedText = (text, query) => {
  // console.log(text, query)
  if (query !== "" && text.toLowerCase().includes(query.toLowerCase())) {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    // console.log("parts", parts);
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} style={{ backgroundColor: "#bad0f1" }}>
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  }

  return text;
};

export const MainMapSearch = React.memo((props) => {
  console.log("props", props);
  const {
    mainSearch: {
      searchList,
      goTothePlace,
      viewAddPostModal,
      setQueryKeyword,
      clickPos,
    }
  } = useOutletContext();

  console.log(searchList,
      goTothePlace,
      viewAddPostModal,
      setQueryKeyword,
      clickPos)

  const [searchKeyword, setSearchKeyword] = useState("");
  const [acSearchKeyword, setAcSearchKeyword] = useState("");
  const [acSearchQueryKeyword, setAcSearchQueryKeyword] = useState("");
  const [acSearchResults, setAcSearchResults] = useState([]);
  // const setQueryKeyword = useSetRecoilState(queryKeywordState);
  useEffect(() => {
    const debounce = setTimeout(() => {
      return setQueryKeyword(searchKeyword);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchKeyword]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      (async () => {
        let data = await sodiApi.map.getAutoCompleteList(acSearchKeyword);
        if (data.features) {
          setAcSearchResults(
            data.features.map(({ text, place_name }) => ({
              text,
              place_name,
            }))
          );
        } else {
          setAcSearchResults([]);
        }
      })();
      // return setAcSearchQueryKeyword(acSearchKeyword);
    }, 300);
    return () => clearTimeout(debounce);
  }, [acSearchKeyword]);

  useEffect(() => {
    if (clickPos.lng !== 0 && clickPos.lat !== 0)
      setSearchKeyword(`${clickPos.lng},${clickPos.lat}`);
  }, [clickPos]);

  const listRef = useRef();

  useEffect(() => {
    console.log(
      "searchList",
      searchList,
      !searchList || (searchList?.length ?? 0) === 0
    );
    const style = listRef.current.style;
    if (!searchList || (searchList?.length ?? 0).length === 0)
      style.maxHeight = 0;
    else {
      style.maxHeight = `${listRef.current.scrollHeight}px`;
    }
  }, [searchList]);

  const [searchAutoFillCnt, setSearchAutoFillCnt] = useState(-1);
  const searchInputKeyDown = useCallback(
    (e) => {
      const { target, key } = e;
      const checkLen = acSearchResults.length;
      let resultCnt;

      if (key === "ArrowUp") {
        e.preventDefault();
        resultCnt =
          searchAutoFillCnt - 1 < 0 ? checkLen - 1 : searchAutoFillCnt - 1;
        setSearchAutoFillCnt(resultCnt);
      } else if (key === "ArrowDown") {
        e.preventDefault();
        resultCnt =
          searchAutoFillCnt + 1 > checkLen - 1 ? 0 : searchAutoFillCnt + 1;
        setSearchAutoFillCnt(resultCnt);
      }

      if (key === "Enter") {
        setSearchKeyword(acSearchResults[searchAutoFillCnt].text);

        setSearchAutoFillCnt(-1);
        setAcSearchResults([]);
      }
    },
    [acSearchResults, searchAutoFillCnt]
  );

  return (
    <>
      <Box className={".cover"}>
        <Box className="inputContainer">
          <TextField
            fullWidth
            variant={"standard"}
            label="Search"
            value={acSearchKeyword}
            autoFocus={true}
            onChange={({ target: { value } }) => setAcSearchKeyword(value)}
            onKeyDown={(e) => searchInputKeyDown(e)}
          />
          <List className={"autoFillList"}>
            {acSearchResults.map(({ text, place_name }, idx) => (
              <ListItem
                className={`autoFillListItem ${
                  searchAutoFillCnt === idx ? "selected" : ""
                }`}
                alignItems="flex-start"
                key={`autoFillListItem_${idx}`}
              >
                <ListItemText
                  primary={text}
                  secondary={
                    <React.Fragment>
                      {/*<Typography*/}
                      {/*    sx={{ display: 'inline' }}*/}
                      {/*    component="span"*/}
                      {/*    variant="body2"*/}
                      {/*    color="text.primary"*/}
                      {/*>*/}
                      {/*    {txt}*/}
                      {/*</Typography>*/}
                      {place_name}
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
          {/*<form>*/}
          {/*    <AddressAutofill accessToken={publicKey2}>*/}
          {/*        <input*/}
          {/*            name="country" placeholder="Country" type="text"*/}
          {/*            autoComplete="country"*/}
          {/*        />*/}
          {/*    </AddressAutofill>*/}
          {/*</form>*/}
        </Box>
        <Box className="searchResults" ref={listRef}>
          <Suspense fallback={<h1>Loading search results...</h1>}>
            {(searchList || []).map(
              ({
                place_name,
                id,
                bbox,
                center,
                geometry: { coordinates },
                text,
                type,
              }) => (
                // {(searchList || []).map(({ bbox, geometry: { coordinates }, properties: { feature_name, description, internal_id, place_name, id } }) => (
                <Card variant="outlined" className={"searchResult"} key={id}>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      place
                    </Typography>
                    <Typography variant="h5" component="div">
                      {highlightedText(text, searchKeyword)}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Test
                    </Typography>
                    <Typography variant="body2">
                      {highlightedText(place_name, searchKeyword)}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      variant={"contained"}
                      color={"primary"}
                      size="small"
                      data-id={id}
                      onClick={(e) => goTothePlace(e)}
                    >
                      Go to the place
                    </Button>
                    <Button
                      variant={"contained"}
                      color={"primary"}
                      size="small"
                      data-id={id}
                      onClick={(e) => {
                        viewAddPostModal({
                          coordinates,
                          bbox,
                          id,
                          place_name,
                        });
                      }}
                    >
                      Add Post
                    </Button>
                  </CardActions>
                </Card>
              )
            )}
          </Suspense>
        </Box>
      </Box>
    </>
  );
});
