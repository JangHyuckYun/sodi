import React, { useEffect } from "react";
import { useObserver } from "mobx-react";
import {
  Box,
  Button,
  Container,
  Fab,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import indexStore from "../../store/indexStore";
import styled from "styled-components";
import { useCallback, useState } from "react";
import { sodiApi } from "../../utils/api";
import { useRecoilValue } from "recoil";
import { messageState } from "../../store/recoilStates";
import { countries } from "country-data-list";
import { useNavigate } from "react-router-dom";
import { FaFileImage, FaUserPlus } from "react-icons/fa";

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

  .user_posts {
    width: 100%;
    position: relative;
    border-radius: 12px;
  }
`;

export const UserInfo = React.memo(() => {
  const { userStore, boardStore } = indexStore();
  const messages = useRecoilValue(messageState);
  const [inputs, setIntpus] = useState({
    email: userStore.user.email ?? "",
    password: "",
    passwordCheck: "",
    name: userStore.user.name ?? "",
    age: userStore.user.age ?? "",
    country: userStore.user.country ?? "",
  });

  console.log("inputs", inputs);

  const [errors, setErrors] = useState({
    password: { state: false, msg: "" },
    age: { state: false, msg: "" },
    name: { state: false, msg: "" },
  });
  const [isSamePassword, setIsSamePassword] = useState(true);
  const [dupliates, setDuplicates] = useState({
    email: false,
    name: false,
  });
  const [profileImg, setProfileImg] = useState("");
  const [backgroundImg, setBackgroundImg] = useState("");
  const [previewProfie, setPreviewProfile] = useState("");
  const [previewBackground, setPreviewBackground] = useState("");

  const encodeFileToBase64 = (fileBlob, type) => {
    console.log("fileBlob", fileBlob);

    if (type === "profile") {
      setProfileImg(fileBlob);
    } else if (type === "background") {
      setBackgroundImg(fileBlob);
    }

    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve) => {
      reader.onload = () => {
        console.log("reader.result", reader.result);
        if (type === "profile") {
          setPreviewProfile(reader.result);
        } else if (type === "background") {
          setPreviewBackground(reader.result);
        }
        resolve();
      };
    });
  };

  useEffect(() => {
    (async () => {
      await userStore.setUser();
      console.log("country", userStore.user.country);
      setIntpus({
        email: userStore.user.email ?? "",
        password: "",
        passwordCheck: "",
        name: userStore.user.name ?? "",
        age: userStore.user.age ?? "",
        country: userStore.user.country ?? "select",
        countryCode: userStore.user.countryCode ?? "select",
        countryOrignTxt:
          userStore.user.countryOrignTxt ??
          JSON.stringify({
            country: userStore.user.country,
            countryCode: userStore.user.countryCode,
          }),
      });
      console.log(
        userStore.user.countryOrignTxt ??
          JSON.stringify({
            country: userStore.user.country,
            countryCode: userStore.user.countryCode,
          })
      );
    })();
  }, []);

  const onChangeInputs = useCallback(
    ({ target }) => {
      const { value, name } = target;

      if (name === "country") {
        const { country, countryCode } = JSON.parse(value);
        setIntpus({
          ...inputs,
          [name]: country,
          countryCode: countryCode,
          countryOrignTxt: value,
        });
      } else {
        setIntpus({
          ...inputs,
          [name]: value,
        });
      }
    },
    [inputs]
  );

  const onChangeAge = useCallback(
    ({ target: { value } }) => {
      setIntpus({
        ...inputs,
        age: value <= 0 ? 1 : value > 120 ? 120 : value,
      });
    },
    [inputs]
  );

  const checkDuplicate = useCallback(
    async (name) => {
      let state =
        inputs[name] === userStore.user[name]
          ? false
          : await sodiApi.user.validate({
              type: name,
              value: inputs[name],
            });
      setDuplicates({
        ...dupliates,
        [name]: state,
      });

      return state;
    },
    [dupliates, inputs]
  );

  const navigate = useNavigate();

  const onClickModifySubmit = useCallback(async () => {
    if ((await checkDuplicate("email")) || (await checkDuplicate("name"))) {
      return false;
    }

    console.log(
      'Object.keys(inputs).filter(key => key !== "password" || key !== "passwordCheck")',
      Object.keys(inputs)
    );

    const isNull = Object.keys(inputs).some((key) => {
      const value = inputs[key];

      if (typeof value === "number") {
        if (
          (key === "age" && value <= 0) ||
          value > 120 ||
          String(value).length === 0
        ) {
          alert(messages.join.age);
          return true;
        }
      } else if (
        key === "country" &&
        (value?.country?.length === 0 || value?.countryCode?.length === 0)
      ) {
        alert(messages.join.isNull.select(key));
        return true;
      } else if ((value?.trim() ?? "").length === 0) {
        alert(messages.join.isNull.select(key));
        return true;
      }
      console.log(key, value !== inputs.passwordCheck, value, inputs);

      if (key === "password" && value !== inputs.passwordCheck) {
        alert(messages.join.isNull.password);
        return true;
      }

      if (key === "country" && value === "select") {
        alert(messages.join.isNull.country);
        return true;
      }

      return false;
    });

    if (isNull) return false;

    let { statusText, errors } = await sodiApi.user.modifyUser(
      inputs,
      userStore.user.id,
      { profileImg, backgroundImg }
    );

    if (statusText === "Created") {
      alert(messages.join.success.create);
    } else {
      console.log("errors", errors);
      errors.some((err) => {
        let [type, msg] = err.split("|");
        console.log(type, msg);
        setErrors({
          ...errors,
          [type]: msg,
        });
      });
    }
  }, [inputs, userStore.user.id]);

  return useObserver(() => {
    return (
      <CustomContainer>
        <Box
          className={"setImageBox"}
          // sx={{ backgroundColor: `${(previewBackground || userStore.user.backgroundImg) ? "none;" : "rgba(0,0,0, .2);"}` }}
        >
          {previewBackground || userStore.user.backgroundImg ? (
            <img
              src={
                !previewBackground
                  ? `../../assets/images/user/${userStore.user.sub}/${userStore.user.backgroundImg}`
                  : previewBackground
              }
              className={"previewBackground"}
              alt=""
            />
          ) : (
            <div
              style={{ background: "rgba(0,0,0, .2)" }}
              className={"previewBackground none"}
            />
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <label htmlFor="upload-photo">
            <input
              style={{ display: "none" }}
              id="upload-photo"
              name="upload-photo"
              type="file"
              onChange={(e) => {
                let file = e.target.files[0];
                if (!file.type.includes("image"))
                  return alert("이미지 파일을 선택하여 주세요.");
                encodeFileToBase64(e.target.files[0], "profile");
              }}
            />

            <Fab
              color="primary"
              component="span"
              aria-label="add"
              sx={{
                width: "50px",
                height: "50px",
                fontSize: "20px",
                backgroundImage: `url(${
                  !previewProfie
                    ? `../../assets/images/user/${userStore.user.sub}/${userStore.user.profileImg}`
                    : previewProfie
                })`,
                backgroundSize: "50px 50px",
                backgroundColor: "#9cc3ff",
              }}
            >
              {!(previewProfie || userStore.user.profileImg) && <FaUserPlus />}
            </Fab>
          </label>

          <label htmlFor="upload-background">
            <input
              style={{ display: "none" }}
              id="upload-background"
              name="upload-background"
              type="file"
              onChange={(e) => {
                let file = e.target.files[0];
                if (!file.type.includes("image"))
                  return alert("이미지 파일을 선택하여 주세요.");
                encodeFileToBase64(e.target.files[0], "background");
              }}
            />

            <Fab
              color="primary"
              size="small"
              component="span"
              aria-label="add"
              sx={{ backgroundColor: "#9cc3ff" }}
            >
              <FaFileImage />
            </Fab>
          </label>
        </Box>
        <Box className={"user_info"}>
          <Box>
            <TextField
              size={"small"}
              value={inputs.email}
              onChange={(e) => onChangeInputs(e)}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={dupliates.email}
              helperText={
                dupliates.email ? messages.join.error.duplicate("email") : ""
              }
              onBlur={(e) => checkDuplicate(e.target.name)}
            />
          </Box>
          <Box>
            <TextField
              size={"small"}
              sx={{ width: "50%" }}
              value={inputs.password}
              onChange={(e) => {
                onChangeInputs(e);
                setIsSamePassword(e.target.value === inputs.passwordCheck);
              }}
              error={errors.password.state}
              helperText={errors.password.state ? errors.password.msg : ""}
              margin="normal"
              required
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              size={"small"}
              sx={{ width: "50%" }}
              value={inputs.passwordCheck}
              onChange={(e) => {
                onChangeInputs(e);
                setIsSamePassword(inputs.password === e.target.value);
              }}
              margin="normal"
              required
              name="passwordCheck"
              label="PasswordCheck"
              type="password"
              id="passwordCheck"
              autoComplete="current-password"
              error={!isSamePassword}
              helperText={!isSamePassword ? "password is not same" : ""}
            />
          </Box>
          <Box>
            <TextField
              size={"small"}
              sx={{ width: "60%" }}
              value={inputs.name}
              onChange={(e) => onChangeInputs(e)}
              margin="normal"
              required
              name="name"
              label="Name"
              type="text"
              id="join_name"
              autoComplete="current-password"
              error={dupliates.name}
              helperText={
                dupliates.name ? messages.join.error.duplicate("name") : ""
              }
              onBlur={(e) => checkDuplicate(e.target.name)}
            />
            <TextField
              size={"small"}
              sx={{ width: "40%" }}
              value={inputs.age}
              margin="normal"
              required
              name="age"
              label="Age"
              type="number"
              id="join_age"
              onChange={(e) => onChangeAge(e)}
              autoComplete="current-password"
            />
          </Box>
          <Box>
            <InputLabel id="country">Country</InputLabel>
            <Select
              size={"small"}
              fullWidth={true}
              label={"Country"}
              labelId={"country"}
              id={"country"}
              name={"country"}
              value={JSON.stringify({
                country: userStore.user.country,
                countryCode: userStore.user.countryCode,
              })}
              onChange={(e) => onChangeInputs(e)}
            >
              <MenuItem value={"select"} selected>
                Select Country...
              </MenuItem>
              {countries?.all?.map(({ name, alpha2 }) => (
                <MenuItem
                  value={JSON.stringify({ country: name, countryCode: alpha2 })}
                  text={name}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </Box>
          <Box>
            <TextField
              fullWidth={true}
              id="outlined-multiline-static"
              label="Multiline"
              labelId={"country"}
              multiline
              rows={3}
            />
          </Box>
        </Box>
        <Box>
          <Button color={"primary"} onClick={onClickModifySubmit}>
            Modify
          </Button>
        </Box>

        <Typography
          id="modal-description"
          variant={"h6"}
          sx={{ whiteSpace: "pre-line", mt: 2, mb: 1 }}
        >
          Boards
        </Typography>
        <Box className={"user_posts"}>
          <ImageList variant="masonry" cols={2} gap={10}>
            {userStore.boards.map((item) => (
              <ImageListItem
                key={item.id}
                sx={{
                  borderRadius: "10px",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  boardStore.open = true;
                  await boardStore.setBoard(item);
                }}
              >
                <img
                  src={`../../../assets/images/202212/${item?.images[0]}?w=248&fit=crop&auto=format`}
                  srcSet={`${item?.images[0]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  alt={item.title}
                  loading="lazy"
                  sx={{ borderRadius: "12px" }}
                />
                <ImageListItemBar title={item.title} subtitle={item.content} />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </CustomContainer>
    );
  });
});
