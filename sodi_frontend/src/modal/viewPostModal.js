import {
    Avatar,
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import {Swiper, SwiperSlide} from "swiper/react";
import React, {useCallback} from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import {FaUserCircle} from "react-icons/fa";

import {A11y, Navigation, Pagination, Scrollbar} from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import styled from "styled-components";
import {modalDefaultstyle} from "./modalDefault";
import {sodiApi} from "../utils/api";

const CustomModal = styled(Modal)`
  padding: 0;
  overflow-y: hidden;

  & pre,
  & p,
  & span,
  & a {
    font-family: sans-serif;
  }

  #modal-modal-content {
    height: 100%;

    .rightBox {
      position: relative;
      max-height: 100%;
      border-radius: 10px;
      box-shadow: 0px 0px 2px rgba(0,0,0, .4);
      display: flex;
      flex-direction: column;
      z-index: 1;
      padding: 5px;

      .commentTitle {
        margin-bottom: 10px;
        border-bottom:1px solid rgba(0,0,0, .2);
      }

      .commentList {
        overflow-y: scroll;
        //height: 80%;
        //box-shadow: 0px 1px 5px rgba(0,0,0, .1);
        overflow-x: hidden;
        padding: 0px 5px;

        ul li {
          padding-left: 0;
        }
      }
      
      .commentInputBox {
        //height: 10%;
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
        object-fit: contain;
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
    ({viewPostModalData, open, handleClose}) => {
        const {title, id, place_name, content, country, images} = viewPostModalData;

        console.log('images', viewPostModalData)

        const onKeyupInComment = useCallback(async ({key, target}) => {
            console.log("asf");
            if (key === "Enter") {
                let {value} = target;
                if (value && value?.trim()?.length === 0)
                    return alert("댓글을 입력하여 주세요.");

                let axiosResponse = await sodiApi.comment.createComment({boardId: id, comment: value});
                console.log('axiosResponse', axiosResponse)
            }
        }, []);

        const uploadContent = useCallback((comment) => {
        }, []);

        return (
            <CustomModal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                data-id={id}
            >
                <Box sx={modalDefaultstyle}>
                    <Box id={"modal-modal-content"} sx={{display: "flex"}}>
                        <Box className={"leftBox"} sx={{flex: 1, maxWidth: "65%"}}>
                            <Box id="modal-modal-description" className={"imgBox"}>
                                <CustomSwiper
                                    // install Swiper modules
                                    modules={[Navigation, Pagination, Scrollbar, A11y]}
                                    spaceBetween={50}
                                    slidesPerView={1}
                                    navigation
                                    pagination={{clickable: true}}
                                    scrollbar={{draggable: true}}
                                    onSwiper={(swiper) => console.log(swiper)}
                                    onSlideChange={() => console.log("slide change")}
                                >
                                    {images?.map((imgSrc) => (
                                        <SwiperSlide>
                                            <img src={"../assets/images/202212/" + imgSrc} alt=""/>
                                        </SwiperSlide>
                                    ))}
                                </CustomSwiper>
                            </Box>
                        </Box>
                        <Box
                            className={"rightBox"}
                            sx={{flex: 0.8, maxWidth: "35%"}}
                        >
                            <Box className={'commentTitle'}>
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
                                {Array(20)
                                    .fill(1)
                                    .map((d, idx) => (
                                        <List dense={true}>
                                            <ListItem
                                                secondaryAction={
                                                    <IconButton edge="end" aria-label="delete">
                                                        <DeleteIcon/>
                                                    </IconButton>
                                                }
                                            >
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <FaUserCircle/>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={"Comment_" + (idx + 1)}
                                                    // secondary={ ? "Secondary text" : null}
                                                    secondary={null}
                                                />
                                            </ListItem>
                                        </List>
                                    ))}
                            </Box>
                            <Box className={'commentInputBox'}>
                                <TextField
                                    id="standard-basic"
                                    fullWidth
                                    label="Commet..."
                                    variant="standard"
                                    onKeyUp={(e) => onKeyupInComment(e)}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </CustomModal>
        );
    }
);
