import { Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import framerSetting from "../utils/framerSetting";

const CustomContainer = styled(Container)`
  height: 100%;
  opacity: 0;
  position: relative;
`;

export const Home = () => {
  return (
    <CustomContainer
      style={{ transition: { duration: 0.5 }}}
      component={motion.div}
      intial={{ opacity:0, position: 'absolute' }}
      animate={{ opacity:1, position: 'relative' }}
      exit={{opacity: 0, position: 'absolute'}}
    >
      <Button variant={'contained'} color={'primary'}>
        hihi
      </Button>
    </CustomContainer>
  );
};
