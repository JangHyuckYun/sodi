import {
  Box,
  Button,
  Checkbox,
  Container, Fab, FilledInput,
  FormControlLabel,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import {
  CustomBothSidesContainer,
  CustomFlexContainer,
} from "../../utils/customTag";
import styled from "styled-components";
import { motion } from "framer-motion";
import framerSetting from "../../utils/framerSetting";
import { useCallback, useState } from "react";
import { countries, lookup } from "country-data-list";
import { useRecoilValue } from "recoil";
import { countrycodeState, messageState } from "../../store/recoilStates";
import { sodiApi } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import {FaFileImage} from "react-icons/fa";

const LoginBgContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100% !important;
  opacity: 0;
  //filter: grayscale(0.7);
  overflow: hidden;

  video {
    position: absolute;
    left: 0;
    bottom:0;
    width: 100%;
    height: 100%;
    transform: scale(1.2);
  }

  .modalContainer {
    padding: 20px !important;

    .leftBox {
      border-radius: 12px !important;
      overflow: hidden;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
`;

const BackBackground = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-image: url("../assets/images/airplane_bg3.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(0.9);
`;

export const JoinContainer = () => {
  const navigate = useNavigate();
  const defaultCode = useRecoilValue(countrycodeState);
  const messages = useRecoilValue(messageState);

  const [inputs, setIntpus] = useState({
    email: "",
    password: "",
    passwordCheck: "",
    name: "",
    age: 1,
    country: "select",
    countryCode: "",
    countryOrignTxt:'',
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
    ({ target }) => {
      const { value, name } = target;


      console.log('target.innerText', target.innerText)

      if (name === "country") {
        const { country, countryCode } = JSON.parse(value);
        console.log('country, countryCode' ,country, countryCode)
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

  const submitJoin = useCallback(async () => {
    if (await checkDuplicate('email') || await checkDuplicate('name')) {
      return false;
    }
    const isNull = Object.keys(inputs).some((key) => {
      const value = inputs[key];

      if (typeof value === "number") {
        if ((key === "age" && value <= 0) || value > 120 || String(value).length === 0) {
          alert(messages.join.age);
          return true;
        }
      } else if (key === "country" && ( value?.country?.length === 0 || value?.countryCode?.length === 0)) {
        alert(messages.join.isNull.select(key));
        return true;
      } else if ((value?.trim() ?? "").length === 0) {
        alert(messages.join.isNull.select(key));
        return true;
      } if (key === "password" && value !== inputs.passwordCheck) {
        alert(messages.join.isNull.password);
        return true;
      } if (key === "country" && value === "select") {
        alert(messages.join.isNull.country);
        return true;
      }
      return false; });

    if (isNull) return false;

    let result = await sodiApi.user.createUser(inputs);
      
      let { statusText } = result;

      console.log(statusText, result.errors);

    if (statusText === "Created") {
      alert(messages.join.success.create);
      return navigate("/auth/login");
    } else {
      result.errors.some(err => {
        let [type, msg] = err.split("|");
        setErrors({
          ...errors,
          [type]: { state:true, msg }
        })
        // alert(msg);
        return true;
      })
    }
  }, [inputs, dupliates]);

  return (
    <LoginBgContainer
      sx={{ width: "100vw", height: "100%" }}
      style={{ transition: { duration: 0.5 } }}
      maxWidth={"lg"}
      component={motion.div}
      intial={{ opacity: 0, position: "absolute" }}
      animate={{ opacity: 1, position: "relative" }}
      exit={{ opacity: 0, position: "absolute" }}
    >
      <BackBackground />
      <CustomBothSidesContainer
          className={'modalContainer'}
        sx={{ width: "58%", top: "50%", transform: "translateY(-50%)" }}
      >
        <Box className={"box rightBox"}>
          <Typography variant={"h4"}>Sign Up</Typography>
          <Box component={"form"}>
            <TextField
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
            <TextField
              value={inputs.password}
              onChange={(e) => {
                onChangeInputs(e);
                setIsSamePassword(e.target.value === inputs.passwordCheck);
              }}
              error={errors.password.state}
              helperText={errors.password.state ? errors.password.msg : ""}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <TextField
              value={inputs.passwordCheck}
              onChange={(e) => {
                onChangeInputs(e);
                setIsSamePassword(inputs.password === e.target.value);
              }}
              margin="normal"
              required
              fullWidth
              name="passwordCheck"
              label="PasswordCheck"
              type="password"
              id="passwordCheck"
              autoComplete="current-password"
              error={!isSamePassword}
              helperText={!isSamePassword ? "password is not same" : ""}
            />

            <TextField
              value={inputs.name}
              onChange={(e) => onChangeInputs(e)}
              margin="normal"
              required
              fullWidth
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
              value={inputs.age}
              margin="normal"
              required
              fullWidth
              name="age"
              label="Age"
              type="number"
              id="join_age"
              onChange={(e) => onChangeAge(e)}
              autoComplete="current-password"
            />

            <InputLabel id="country">Country</InputLabel>
            <Select
              fullWidth={true}
              label={"Country"}
              labelId={"country"}
              id={"country"}
              name={"country"}
              value={inputs.countryOrignTxt}
              onChange={(e) => onChangeInputs(e)}
            >
              <MenuItem value={"select"} selected>
                Select Country...
              </MenuItem>
              {countries?.all?.map(({ name, alpha2 }) => (
                <MenuItem value={JSON.stringify({ country:name,  countryCode: alpha2})}>{name}</MenuItem>
              ))}
            </Select>
            <br />

            {/*<FormControlLabel*/}
            {/*  control={<Checkbox value="remember" color="primary" />}*/}
            {/*  label="Remember me"*/}
            {/*/>*/}
            <Button
              type="button"
              fullWidth
              variant="contained"
              onClick={() => submitJoin()}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/auth/login" variant="body2">
                  {"Do you have an account? Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box className={"box leftBox"}>
          <img src={"../assets/images/gif_1.gif"} alt="" />
        </Box>
      </CustomBothSidesContainer>
    </LoginBgContainer>
  );
};
