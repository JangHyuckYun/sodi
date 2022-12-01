import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { CustomBothSidesContainer, CustomFlexContainer } from '../../utils/customTag';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import framerSetting from "../../utils/framerSetting";
import {useState} from "react";
import {useNavigate} from "react-router";
import {sodiApi} from "../../utils/api";
const LoginBgContainer = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 100% !important;
  filter: grayscale(0.7);
  opacity: 0;
`;

const BackBackground = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-image: url('../assets/images/airplane_bg3.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  filter: blur(0.9);
`;

export const LoginContainer = () => {
  let [loginId, setLoginId] = useState("");
  let [password, setPassword] = useState("");

  let navigate = useNavigate();

  const loginProcess = async () => {
    let { message, statusCode } = await sodiApi.user.login(loginId, password);

    if ([200,201].includes(statusCode)) {
      alert(message);

      return navigate("/main/map");
    }
    return alert(message);
  };

  return (
    <LoginBgContainer
      sx={{ width: '100vw', height: '100%' }}
      style={{ transition: { duration: 0.5 }}}
      maxWidth={'lg'}
      component={motion.div}
      intial={{ opacity:0, position: 'absolute' }}
      animate={{ opacity:1, position: 'relative' }}
      exit={{opacity: 0, position: 'absolute'}}
    >
      <BackBackground />
      <CustomBothSidesContainer sx={{ width: '58%', top: '50%', transform: 'translateY(-50%)' }}>
        <Box className={'box leftBox'}>
          <img src={'../assets/images/airplane.png'} alt="" />
        </Box>
        <Box className={'box rightBox'}>
          <Typography variant={'h4'}>Sign in</Typography>
          <Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={() => loginProcess()}>
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </CustomBothSidesContainer>
    </LoginBgContainer>
  );
};
