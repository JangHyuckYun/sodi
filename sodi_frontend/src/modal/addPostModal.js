import React, { useCallback, useEffect, useState } from "react";
import { sodiApi } from "../utils/api";
import {
  Box,
  Button,
  ButtonGroup,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import ImageUploading from "react-images-uploading";
import { modalDefaultstyle } from "./modalDefault";
import addModalStore from "../store/add.modal.store";
import {useObserver} from "mobx-react";
import indexStore from "../store/indexStore";
import styled from "styled-components";

const CustomBox = styled(Box)`
  .modalCover {
    
  }

  #modal-modal-description {
    background: red;
  }
`;

export const AddPostModal = React.memo(
  () => {
      const { searchStore } = indexStore();
    const { coordinates, bbox, id, place_name } = addModalStore.addPostModalData;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [country, setCountry] = useState(place_name);
    const [images, setImages] = useState([]);
    const maxNumber = 5;
    const onChange = (imageList, addUpdateIndex) => {
      // data for submit
      console.log(imageList, addUpdateIndex);
      setImages(imageList);
    };

    useEffect(() => {
      setCountry(place_name);
    }, [place_name]);
    console.log("country", country);

    const uploadPost = useCallback(async () => {
      console.log(title, content, country, images);
      if ([title, country].some((str) => (str?.trim() || "").length === 0))
        return alert("제목 또는 도시의 값을 입력해주세요.");
      await sodiApi.board.uploadPost(
        {
          title,
          content,
          country,
          longitude: coordinates[0],
          latitude: coordinates[1],
            originalCountryInfo: JSON.stringify(searchStore.originalCountryInfo)
        },
        images
      );

      alert("글 등록이 완료되었습니다.");
      addModalStore.handleClose();
    }, [title, content, country, images]);

    return useObserver(() => {
        return (
            <CustomBox>
                <Modal
                    open={addModalStore.open}
                    onClose={() => addModalStore.open = false}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    data-id={id}
                >
                    <Box
                        sx={{
                            ...modalDefaultstyle,
                            height: "auto",
                            minHeight: "72%",
                            overflow: "hidden",
                            p:2
                        }}
                        className={'modalCover'}
                    >
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            sx={{ borderBottom: "1px solid rgba(0,0,0, .15)", mb: 2, pb: 1 }}
                        >
                            Add Post Modal
                        </Typography>
                        <Box id="modal-modal-description" className={"countryBox"}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <TextField
                                    sx={{ flex: 0.85 }}
                                    fullWidth
                                    id="outlined-basic"
                                    label="Title"
                                    variant="outlined"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </Box>
                        </Box>

                        <Box id="modal-modal-description" className={"contentBox"}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <TextField
                                    sx={{ flex: 0.85 }}
                                    fullWidth
                                    id="outlined-basic"
                                    label="Content"
                                    variant="outlined"
                                    multiline
                                    rows={6}
                                    maxRows={6}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                            </Box>
                        </Box>

                        <Box id="modal-modal-description" className={"countryBox"}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <TextField
                                    sx={{ flex: 0.85 }}
                                    fullWidth
                                    id="outlined-basic"
                                    label="Country"
                                    variant="outlined"
                                    readOnly={false}
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                />
                            </Box>
                        </Box>

                        <Box id="modal-modal-description" className={"countryBox"}>
                            <ImageUploading
                                multiple
                                value={images}
                                onChange={onChange}
                                maxNumber={maxNumber}
                                dataURLKey="data_url"
                            >
                                {({
                                      imageList,
                                      onImageUpload,
                                      onImageRemoveAll,
                                      onImageUpdate,
                                      onImageRemove,
                                      isDragging,
                                      dragProps,
                                  }) => (
                                    // write your building UI
                                    <Box
                                        className="upload__image-wrapper"
                                        sx={{ mt: 2, borderTop: "1px solid rgba(0,0,0, .2)" }}
                                    >
                                        <ButtonGroup sx={{ pt: 1 }}>
                                            <Button
                                                size={"small"}
                                                style={isDragging ? { color: "red" } : undefined}
                                                onClick={onImageUpload}
                                                {...dragProps}
                                            >
                                                Click or Drop here
                                            </Button>
                                            <Button size={"small"} onClick={onImageRemoveAll}>
                                                Remove all images
                                            </Button>
                                        </ButtonGroup>
                                        <ImageList cols={5}>
                                            {imageList.map((image, index) => (
                                                <ImageListItem key={index} className="image-item">
                                                    {/* alt="" width="100" */}
                                                    <img
                                                        src={image["data_url"]}
                                                        srcSet={image["data_url"]}
                                                    />
                                                    <ImageListItemBar
                                                        position="below"
                                                        subtitle={
                                                            <>
                                                                <Button onClick={() => onImageUpdate(index)}>
                                                                    Update
                                                                </Button>
                                                                <Button onClick={() => onImageRemove(index)}>
                                                                    Remove
                                                                </Button>
                                                            </>
                                                        }
                                                    />
                                                </ImageListItem>
                                            ))}
                                        </ImageList>
                                    </Box>
                                )}
                            </ImageUploading>
                        </Box>
                        <Box
                            id={"modal-modal-button-box"}
                            sx={{ borderTop: "1px solid rgba(0,0,0, .2)", pt: 1 }}
                        >
                            <Button onClick={() => uploadPost()}>Upload Post</Button>
                        </Box>
                    </Box>
                </Modal>
            </CustomBox>
        );
    });
  }
);
