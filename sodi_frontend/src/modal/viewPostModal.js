import {
  Avatar,
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import React, { useCallback, useEffect, useState } from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { FaHeart, FaRegHeart, FaUserCircle } from "react-icons/fa";

import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import styled from "styled-components";
import { modalDefaultstyle } from "./modalDefault";
import { sodiApi } from "../utils/api";
import { FiSend } from "react-icons/fi";
import {detailDate} from "../utils/util";
import indexStore from "../store/indexStore";
import {useObserver} from "mobx-react";

const CustomModal = styled(Modal)`
  padding: 0;
  overflow-y: hidden;
  outline: none;

  & pre,
  & p,
  & span,
  & a {
    font-family: sans-serif;
  }

  #modal-modal-content {
    height: 100%;
    outline: none;

    .leftBox {
      overflow: hidden;
    }

    .rightBox {
      position: relative;
      max-height: 100%;
      border-radius: 10px;
      box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      z-index: 1;
      box-sizing: border-box;

      .commentTitle {
        margin-bottom: 10px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
        padding: 10px;
      }

      .commentList {
      min-height: 75%;
        overflow-y: scroll;
        padding: 10px;
        //height: 80%;
        //box-shadow: 0px 1px 5px rgba(0,0,0, .1);
        overflow-x: hidden;
        //padding: 0px 8px;

        .comment {
          border-bottom: 1px solid rgba(0, 0, 0, 0.15);
          margin-bottom: 13px;

          .avatar {
            svg {
              font-size: 22px;
            }
          }

          .commentText {
            padding-left: 10px !important;
          }
        }

        ul li {
          padding-left: 0;
        }
      }

      .commentBottomBox {
        //height: 10%;

        width: 100%;
        height: 300px;
        border-top: 1px solid rgba(0, 0, 0, 0.3);
        border-radius: 12px;
      }
    }
  }

  .imgBox {
    height: 100%;

    .swiper-initialized {
      height: 100%;
    }

    .swiper-wrapper {
      width: 100%;

      * {
        max-height: 100%;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .contentBox {
    margin-top: 10px;
  }
`;

const CustomSwiper = styled(Swiper)`
  //max-height: 80vh;
  //position: relative;
  //img {
  //  width: 100;
  //  object-fit: cover;
  //}
`;

export const ViewPostModal = React.memo(
  ({ handleClose }) => {
    let { searchStore, boardStore, addModalStore } = indexStore();
    const { title, id, place_name, content, country, images } =
        boardStore.board;
    const [comments, setComments] = useState([]);
    const [commentTexts, setCommentTexts] = useState("");
    const [replyId, setReplyId] = useState(0);

    // const comment_query = useQuery(
    //     ["commentList"],
    //     () => sodiApi.comment.findAllByBoardId(id),0
    //     {
    //         onError: (err) => (error) => toast.error("asfsfafas"),
    //     }
    // );
    // console.log('comment_query', comment_query)

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
          <CustomModal
              open={boardStore.open}
              onClose={() => boardStore.open = false}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              data-id={id}
          >
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
                      {images?.map((imgSrc, idx) => (
                          <SwiperSlide key={`viewPostModal_slide_img_swiper_${idx}`}>
                            <img key={`viewPostModal_slide_img_${idx}`} src={`../../assets/images/user/${boardStore.board.userId}/${imgSrc}`} alt="" />
                          </SwiperSlide>
                      ))}
                    </CustomSwiper>
                  </Box>
                </Box>
                <Box className={"rightBox"} sx={{ flex: 0.4 }}>
                  <Box className={"commentTitle"}>
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                      {title}
                    </Typography>
                    <Box className={"contentBox"}>
                      <Typography variant="pre" component="pre">
                        {content}
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
          </CustomModal>
      );
    });
  }
);
