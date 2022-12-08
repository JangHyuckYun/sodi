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
import { publicKey2, sodiApi } from "../../utils/api";
import { useOutletContext } from "react-router";
import indexStore from "../../store/indexStore";
import {useObserver} from "mobx-react";

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

export const MainMapSearch = React.memo(() => {
  let { searchStore } = indexStore();
  // const { updateTest } = searchStore;
  const {
    goTothePlace,
    viewAddPostModal,
  } = useOutletContext();

  const [searchKeyword, setSearchKeyword] = useState("");


  useEffect(() => {
    const debounce = setTimeout(() => {
      // return setQueryKeyword(searchKeyword);
      return searchStore.updateSearchList(searchKeyword);
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchKeyword]);

  useEffect(() => {
    if (!searchStore.acSearchKeywordOnlyTxt) {
      const debounce = setTimeout(() => {
        (async () => {
          let data = await sodiApi.map.getAutoCompleteList(searchStore.acSearchKeyword);
          if (data.features) {
            searchStore.acSearchResults = data.features.map(({ text, place_name }) => ({
              text,
              place_name,
            })) ?? [];

          }else {
            searchStore.acSearchResults = [];
          }
        })();
        // return setAcSearchQueryKeyword(acSearchKeyword);
      }, 300);
      return () => clearTimeout(debounce);
    }
  }, [searchStore.acSearchKeyword, searchStore.acSearchKeywordOnlyTxt]);

  const listRef = useRef();
  useEffect(() => {

    const style = listRef.current.style;
    if (!searchStore.searchList || (searchStore.searchList?.length ?? 0).length === 0)
      style.maxHeight = 0;
    else {
      style.maxHeight = `${listRef.current.scrollHeight}px`;
    }
  }, [searchStore.searchList]);

  const [searchAutoFillCnt, setSearchAutoFillCnt] = useState(-1);
  const searchInputKeyDown = useCallback(
      (e) => {
        const { target, key } = e;
        const checkLen = searchStore.acSearchResults.length;
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
          let txt = searchStore.acSearchResults[searchAutoFillCnt].text;
          setSearchKeyword(txt);
          setSearchAutoFillCnt(-1);
          searchStore.acSearchKeyword = txt;
          searchStore.acSearchKeywordOnlyTxt = true;
          searchStore.acSearchResults = [];
        } else if (searchStore.acSearchKeywordOnlyTxt){
          searchStore.acSearchKeywordOnlyTxt = false;
        }
      },
      [searchStore.acSearchResults, searchAutoFillCnt]
  );

  return useObserver(() => {
    return (
        <>
          <Box className={".cover"}>
            <Box className="inputContainer">
              <TextField
                  fullWidth
                  variant={"standard"}
                  label="Search"
                  value={searchStore.acSearchKeyword}
                  autoFocus={true}
                  onChange={({ target: { value } }) => {
                    searchStore.acSearchKeyword = value;
                    if (value === "") {
                      searchStore.searchList = [];
                    }
                  }}
                  onKeyDown={(e) => searchInputKeyDown(e)}
              />
              <List className={"autoFillList"}>
                {searchStore.acSearchResults.length > 0 ? searchStore.acSearchResults.map(({ text, place_name }, idx) => (
                    <ListItem
                        style={{ cursor:'pointer' }}
                        className={`autoFillListItem ${
                            searchAutoFillCnt === idx ? "selected" : ""
                        }`}
                        onMouseEnter={() => setSearchAutoFillCnt(idx)}
                        onMouseLeave={() => setSearchAutoFillCnt(-1)}
                        onClick={() => {
                          let txt = searchStore.acSearchResults[searchAutoFillCnt].text;
                          setSearchKeyword(searchStore.acSearchResults[searchAutoFillCnt].text);

                          searchStore.acSearchKeywordOnlyTxt = true;
                          searchStore.acSearchKeyword = txt;
                          setSearchAutoFillCnt(-1);
                          searchStore.acSearchResults = [];
                        }}
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
                )) : ""}
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
                {(searchStore.searchList || [])?.map(
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
  })
})
