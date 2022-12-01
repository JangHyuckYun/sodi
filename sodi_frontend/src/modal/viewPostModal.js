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
  Typography
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import React from "react";

import DeleteIcon from '@mui/icons-material/Delete';
import { FaUserCircle } from "react-icons/fa";

import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import styled from "styled-components";
import {modalDefaultstyle} from "./modalDefault";

const CustomModal = styled(Modal)`
  & pre, & p, & span, & a {
    font-family: sans-serif;
  }
  
  #modal-modal-title {
    margin-bottom: 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  }
  
  #modal-modal-content {
    height: 94%;
  }

  .swiper-wrapper {
    max-height: 500px;
    * {
      max-height: 500px;
    }
    
    .swiper-slide-active {
      border-radius: 10px;
      box-shadow: 1px 1px 5px rgba(0,0,0, .5);
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .contentBox {
    margin-top: 10px;
  }
  
  .commentBox {
    max-height: 100%;
    border-left: 1px solid rgba(0,0,0, .2);
    padding-left:10px;
    margin-left: 10px;
    border-radius: 10px;
    .commentList {
      overflow-y: scroll;
      max-height: 94%;
      //box-shadow: 0px 1px 5px rgba(0,0,0, .1);
      overflow-x: hidden;
      padding: 0px 5px;
      ul li {
        padding-left: 0;
      }
    }
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

export const ViewPostModal = ({ viewPostModalData, open, handleClose }) => {
  const { title, id, place_name, content, country } = viewPostModalData;
  let imageArr = Array(5)
    .fill(1)
    .map((d, idx) => viewPostModalData[`image${idx + 1}`])
    .filter((img) => img?.trim()?.length > 0);
  console.log(imageArr);
  return (
    <CustomModal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      data-id={id}
    >
      <Box sx={modalDefaultstyle}>
        <Typography id="modal-modal-title" variant="h5" component="h2">
          {title}
        </Typography>
        <Box id={"modal-modal-content"} sx={{ display:'flex' }}>
          <Box sx={{flex:1, maxWidth:'65%'}}>
            <Box id="modal-modal-description" className={"countryBox"}>
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
                {imageArr.map((imgSrc) => (
                    <SwiperSlide>
                      <img src={"../assets/images/202211/" + imgSrc} alt="" />
                    </SwiperSlide>
                ))}
              </CustomSwiper>
            </Box>
            <Box className={"contentBox"}>
              <Typography variant="pre" component="pre">
                {content}
              </Typography>
            </Box>
          </Box>
          <Box className={"commentBox"} sx={{flex:1, maxWidth:'35%', pl:3}} >
            <Box>
              <TextField
                  id="standard-basic"
                  fullWidth
                  label="Commet..."
                  variant="standard"
              />
            </Box>
            <Box className={"commentList"}>
              {Array(20).fill(1).map((d, idx) => (
                  <List dense={true}>
                    <ListItem
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                          </IconButton>
                        }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <FaUserCircle />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                          primary={'Comment_'+ (idx + 1)}
                          // secondary={ ? "Secondary text" : null}
                          secondary={null}
                      />
                    </ListItem>
                  </List>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </CustomModal>
  );
};
