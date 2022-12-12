import {Box, Button, Container} from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import framerSetting from "../utils/framerSetting";
import {useEffect, useState} from "react";
import {sodiApi} from "../utils/api";
import {useNavigate} from "react-router";

const CustomContainer = styled(Container)`
  height: 100%;
  opacity: 0;
  position: relative;
`;

export const Home = () => {
  let [loginId, setLoginId] = useState("");
  let [password, setPassword] = useState("");
  let navigate = useNavigate();

  const loginProcess = async () => {
    let status = await sodiApi.user.login(loginId, password);
    if ([200,201].includes(status)) {
     return navigate("/main");
    }
    return alert('아이디 또는 비밀번호를 확인해 주세요.');
  };

  useEffect(() => {
    (async () => {
      // console.log(await sodiApi.user.findAll());
    })();
  }, []);

  return (
    <CustomContainer
      style={{ transition: { duration: 0.5 }}}
      component={motion.div}
      intial={{ opacity:0, position: 'absolute' }}
      animate={{ opacity:1, position: 'relative' }}
      exit={{opacity: 0, position: 'absolute'}}
    >

      <Box>
        <input type="text" name={"username"} value={loginId} onChange={(e) => setLoginId(e.target.value)} placeholder={"loginId"}/>
        <input type="password" name={"password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={"password"}/>
        <Button color={"primary"} onClick={() => loginProcess()} >Login</Button>
      </Box>

    </CustomContainer>
  );
};
