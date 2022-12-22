import React, {useEffect} from "react";
import {useObserver} from "mobx-react";
import indexStore from "../../store/indexStore";
import styled from "styled-components";
import {Box, Container, ImageList, ImageListItem, ImageListItemBar, Typography} from "@mui/material";

const CustomContainer = styled(Container)`
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow-y: auto;
  padding: 0 !important;
  position: relative;

  .setImageBox {
    transition: 0.22s;
    min-height: 208px;

    .previewBackground {
      opacity: 0.8;
      position: relative;
      top: 0px;
      border-radius: 12px;
      width: 100%;
      min-height: 230px;
      max-height: 320px;
      z-index: -100;
      object-fit: cover;
    }
  }

  .user_info {
    height: 40%;
  }

  .boards {
    width: 100%;
    position: relative;
    border-radius: 12px;
  }
`;

export const BoardAll = React.memo(() => {
  const { boardStore } = indexStore();
  useEffect(() => {
    (async () => {
      await boardStore.setBoardList();
    })();
  }, []);
  return useObserver(() => {
    return (
      <CustomContainer>
        {boardStore.boardList.original.length > 0
          ? Object.keys(boardStore.boardList.refine).map((countryName) => (
              <Box key={countryName}>
                <Typography variant={"h6"}>{ countryName }</Typography>
                  <Box className={'boards'}>
                      <ImageList variant="masonry" cols={3} gap={10}>
                          {boardStore.boardList.refine[countryName].map((item) => {
                              let { id, title, content, hits, images, userId } = item;
                            if (/^\[[a-zA-Z0-9ㄱ-ㅎ가-힣_\"\,\.]+\]$/g.test(images)) { images = (JSON.parse(images))[0]; }
                              return (
                                  <ImageListItem
                                      key={id}
                                      sx={{
                                          borderRadius: "10px",
                                          overflow: "hidden",
                                          cursor: "pointer",
                                      }}
                                      onClick={async () => { boardStore.open = true; await boardStore.setBoard(item);
                                      }}>
                                      <img
                                          src={`../../../assets/images/user/${userId}/${images}?w=248&fit=crop&auto=format`}
                                          srcSet={`../../../assets/images/user/${userId}/${images}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                          alt={title} loading="lazy" sx={{ borderRadius: "12px" }}
                                      />
                                      <ImageListItemBar title={title} subtitle={content} />
                                  </ImageListItem>
                              )
                          })}
                      </ImageList>
                  </Box>
              </Box>
            ))
          : ""}
      </CustomContainer>
    );
  });
});
