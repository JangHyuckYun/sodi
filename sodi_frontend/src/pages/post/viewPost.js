import React, { useCallback, useEffect, useState } from "react";
import { useObserver } from "mobx-react";
import { sodiApi } from "../../utils/api";
import { modalDefaultstyle } from "../../modal/modalDefault";
import { Box, Container, Grid, TextField, Typography } from "@mui/material";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { FaHeart, FaRegHeart, FaUserCircle } from "react-icons/fa";
import { detailDate } from "../../utils/util";
import { FiSend } from "react-icons/fi";
import styled from "styled-components";
import { useParams } from "react-router";
import indexStore from "../../store/indexStore";

const CustomContainer = styled(Container)`
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  padding: 0 !important;
  position: relative;
`;

const CustomSwiper = styled(Swiper)`
  //max-height: 80vh;
  //position: relative;
  //img {
  //  width: 100;
  //  object-fit: cover;
  //}
`;

export const ViewPost = React.memo(() => {
  const { boardStore } = indexStore();
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [commentTexts, setCommentTexts] = useState("");
  const [replyId, setReplyId] = useState(0);

  const loadCommentList = useCallback(async () => {
    const commentList = await sodiApi.comment.findAllByBoardId(Number(id));
    setComments(commentList.data);
  }, [id]);

  useEffect(() => {
    if (id) {
      loadCommentList();
    }
  }, [id]);

  const onKeyupInComment = useCallback(
    async ({ key, target }) => {
      if (key === "Enter") {
        let { value } = target;
        if (value && value?.trim()?.length === 0)
          return alert("댓글을 입력하여 주세요.");

        let replyName = "";
        if (value?.includes("@")) {
          replyName = value.split(" ")[0]?.substr(1);
          if (replyName.length === "0")
            return alert("답글할 상대의 이름을 입력해 주세요.");
        }

        let axiosResponse = await sodiApi.comment.createComment({
          boardId: id,
          content: value,
          replyName,
          replyId: Number(replyId),
        });
        if (axiosResponse?.statusText === "Created") {
          loadCommentList();
        }

        setCommentTexts(() => "");
        setReplyId(() => 0);
      }
    },
    [id, replyId]
  );

  return useObserver(() => {
    return (
      <CustomContainer>
        <Box sx={modalDefaultstyle}>
          <Box id={"modal-modal-content"} sx={{ display: "flex" }}>
            <Box className={"leftBox"} sx={{ flex: 1 }}>
              <Box id="modal-modal-description" className={"imgBox"}>
                <CustomSwiper
                  // install Swiper modules
                  modules={[Navigation, Pagination, Scrollbar, A11y]}
                  spaceBetween={50}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  scrollbar={{ draggable: true }}
                  onSwiper={(swiper) => console.log(swiper)}
                  onSlideChange={() => console.log("slide change")}
                >
                  {boardStore.boardimages?.map((imgSrc, idx) => (
                    <SwiperSlide key={`viewPostModal_slide_img_swiper_${idx}`}>
                      <img
                        key={`viewPostModal_slide_img_${idx}`}
                        src={"../assets/images/202212/" + imgSrc}
                        alt=""
                      />
                    </SwiperSlide>
                  ))}
                </CustomSwiper>
              </Box>
            </Box>
            <Box className={"rightBox"} sx={{ flex: 0.4 }}>
              <Box className={"commentTitle"}>
                <Typography id="modal-modal-title" variant="h5" component="h2">
                  {boardStore.board.title}
                </Typography>
                <Box className={"contentBox"}>
                  <Typography variant="pre" component="pre">
                    {boardStore.board.content}
                  </Typography>
                </Box>
              </Box>
              <Box className={"commentList"}>
                {comments &&
                  comments?.map(
                    ({ id, writer, depth, content, createDate }, idx) => (
                      <Grid
                        container
                        wrap="nowrap"
                        spacing={3}
                        className={"comment"}
                        key={`viewPostModal_comment_${idx}`}
                      >
                        <Grid item className={"avatar"}>
                          {/*<Avatar alt="Remy Sharp" src={imgLink} />*/}
                          <FaUserCircle />
                        </Grid>
                        <Grid
                          justifyContent="left"
                          item
                          xs
                          zeroMinWidth
                          className={"commentText"}
                        >
                          <h4 style={{ margin: 0, textAlign: "left" }}>
                            {writer}
                          </h4>
                          <p style={{ textAlign: "left" }}>{content}</p>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              paddingRight: 5,
                            }}
                          >
                            <p style={{ textAlign: "left", color: "gray" }}>
                              posted {detailDate(new Date(createDate))}
                            </p>
                            <p
                              style={{
                                textAlign: "left",
                                color: "gray",
                                cursor: "pointer",
                                fontWeight: "bld",
                                textDecoration: "underline",
                              }}
                              onClick={(e) => {
                                setReplyId(Number(id));
                                if (commentTexts.includes("@")) {
                                  let match = commentTexts.match(
                                    /(?=.*[@])[@a-zA-Z0-9]+[- ]?/,
                                    "g"
                                  );
                                  if (match[0]) {
                                    setCommentTexts(
                                      `@${writer} ${commentTexts.replace(
                                        match[0],
                                        ""
                                      )}`
                                    );
                                  }
                                } else {
                                  setCommentTexts(`@${writer} ${commentTexts}`);
                                }
                              }}
                            >
                              reply
                            </p>
                          </Box>
                        </Grid>
                      </Grid>
                    )
                  )}
              </Box>
              <Box className={"commentBottomBox"}>
                <Box>
                  <FaRegHeart />
                  <FaHeart />
                </Box>
                <TextField
                  id="standard-basic"
                  fullWidth
                  label="Commet..."
                  variant="standard"
                  value={commentTexts}
                  onChange={({ target: { value } }) =>
                    setCommentTexts(() => value)
                  }
                  onKeyUp={(e) => onKeyupInComment(e)}
                />
                <FiSend />
              </Box>
            </Box>
          </Box>
        </Box>
      </CustomContainer>
    );
  });
});
