import {
    Box,
    Button, ButtonGroup,
    Card,
    CardActions,
    CardContent,
    TextField,
    Typography,
} from "@mui/material";
import React, {Suspense, useEffect, useState} from "react";
import styled from "styled-components";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {queryKeywordState} from "../../store/recoilStates";

const SearchContainer = styled.div`
  flex: 0.25;
  position: fixed;
  background: white;
  width: 25%;
  height: 100%;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
  padding: 15px;
  border-radius: 12px;
  
  

  & .inputContainer {
    margin-bottom: 35px;
    
    input {
      border-radius: 12px;
    }
  }

  & .searchResults {
    position: relative;
    max-height: 90vh;
    overflow-y: auto;

    & .searchResult {
      margin-bottom: 10px;
    }
  }
`;

export const MainMapSearch = React.memo(({ searchList, goTothePlace, viewAddPostModal, setQueryKeyword, clickPos }) => {
    const [searchKeyword, setSearchKeyword] = useState("");
    // const setQueryKeyword = useSetRecoilState(queryKeywordState);
    console.log('clickPos', clickPos)
    useEffect(() => {
        const debounce = setTimeout(() => {
            return setQueryKeyword(searchKeyword);
        }, 300);
        return () => clearTimeout(debounce);
    }, [searchKeyword]);

    useEffect(() => {
        setSearchKeyword(`${clickPos.lng},${clickPos.lat}`);
    }, [clickPos]);

  return (
    <SearchContainer>
      <Box className="inputContainer">
        <TextField
          fullWidth
          id="outlined-basic"
          value={searchKeyword}
          label="Search"
          variant="outlined"
          onChange={({target: { value }}) => setSearchKeyword(value)}
        />
      </Box>
      <Box className="searchResults">
        <Suspense fallback={<h1>Loading search results...</h1>}>
          {(searchList || []).map(({ place_name, id, bbox, center, geometry: { coordinates }, text, type }) => (
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
                  {place_name}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Test
                </Typography>
                <Typography variant="body2">
                  well meaning and kindly.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
              <CardActions>
                <ButtonGroup>
                    <Button
                        size="small"
                        data-id={id}
                        onClick={(e) => goTothePlace(e)}
                    >
                        Go to the place
                    </Button>
                    <Button
                        size="small"
                        data-id={id}
                        onClick={(e) => {
                            console.log('click')
                            viewAddPostModal({coordinates, bbox, id, place_name, text, type});
                        }}
                    >
                        Add Post
                    </Button>
                </ButtonGroup>
              </CardActions>
            </Card>
          ))}
        </Suspense>
      </Box>
    </SearchContainer>
  );
});
