import React, { useEffect } from "react";
import { useObserver } from "mobx-react";
import {
  Box,
  Container,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputLabel, MenuItem, Select,
  TextField,
  Typography
} from "@mui/material";
import indexStore from "../../store/indexStore";
import styled from "styled-components";
import {useCallback, useState} from "react";
import {sodiApi} from "../../utils/api";
import {useRecoilValue} from "recoil";
import {messageState} from "../../store/recoilStates";
import {countries} from "country-data-list";

const CustomContainer = styled(Container)`
  width:100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  padding:0 !important;
  position: relative;
  
  .user_info {
    height: 40%;
  }
  
  .user_posts {
    width: 100%;
    height: 50%;
    max-height: 49.5%;
    position: relative;
    overflow-y: auto;
    border-radius: 12px;
  }
`;

export const UserInfo = React.memo(() => {
  const { userStore } = indexStore();
  const messages = useRecoilValue(messageState);
  const [inputs, setIntpus] = useState({
    email: userStore.user.email,
    password: "",
    passwordCheck: "",
    name: userStore.user.name,
    age: userStore.user.age,
    country: userStore.user.country,
  });
  const [errors, setErrors] = useState({
    password: { state:false, msg:'' },
    age: { state:false, msg:'' },
  });
  const [isSamePassword, setIsSamePassword] = useState(true);
  const [dupliates, setDuplicates] = useState({
    email: false,
    name: false,
  });

  const onChangeInputs = useCallback(
      ({ target: { value, name } }) => {
        setIntpus({
          ...inputs,
          [name]: value,
        });
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
        let state = await sodiApi.user.validate({
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

  useEffect(() => {
    userStore.setUser();
  }, []);


  return useObserver(() => {
    return (
      <CustomContainer>
        <Typography
          id="modal-description"
          variant={"h6"}
          sx={{ whiteSpace: "pre-line", mt: 2, mb: 1 }}
        >
          UserInfo
        </Typography>
          <Box className={'user_info'}>
            <Box>
              <TextField
                  size={'small'}
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
                  size={'small'}
                  sx={{width:'50%'}}
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
                  size={'small'}
                  sx={{width:'50%'}}
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
                  size={'small'}
                  sx={{width:'60%'}}
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
                  size={'small'}
                  sx={{width:'40%'}}
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
                  size={'small'}
                  fullWidth={true}
                  label={"Country"}
                  labelId={"country"}
                  id={"country"}
                  name={"country"}
                  value={inputs.country}
                  onChange={(e) => onChangeInputs(e)}
              >
                <MenuItem value={"select"} selected>
                  Select Country...
                </MenuItem>
                {countries?.all?.map(({ name, alpha2 }) => (
                    <MenuItem value={alpha2}>{name}</MenuItem>
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

        <Typography
            id="modal-description"
            variant={"h6"}
            sx={{ whiteSpace: "pre-line", mt: 2, mb: 1 }}
        >
          Boards
        </Typography>
          <Box className={'user_posts'}>
            <ImageList variant="masonry" cols={2} gap={10}>
              {userStore.boards.map((item) => (
                  <ImageListItem key={item.id} sx={{ borderRadius:'10px', overflow:'hidden' }}>
                    <img
                        src={`../../../assets/images/202212/${item?.images[0]}?w=248&fit=crop&auto=format`}
                        srcSet={`${item?.images[0]}?w=248&fit=crop&auto=format&dpr=2 2x`}
                        alt={item.title}
                        loading="lazy"
                        sx={{ borderRadius:'12px' }}
                    />
                    <ImageListItemBar
                      title={item.title}
                      subtitle={item.content}
                    />
                  </ImageListItem>
              ))}
            </ImageList>
          </Box>
      </CustomContainer>
    );
  });
});
