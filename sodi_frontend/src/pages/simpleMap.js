import { Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import framerSetting from "../utils/framerSetting";
import {ComposableMap, Geographies, Geography} from "react-simple-maps";
import countries from "../assets/json/countries-50m.json";

const CustomContainer = styled(Container)`
  height: 100%;
  opacity: 0;
  position: relative;
`;

export const SimpleMap = () => {
    return (
        <CustomContainer
            style={{ transition: { duration: 0.5 }}}
            component={motion.div}
            intial={{ opacity:0, position: 'absolute' }}
            animate={{ opacity:1, position: 'relative' }}
            exit={{opacity: 0, position: 'absolute'}}
        >
            <ComposableMap>
                <Geographies geography={countries}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography key={geo.rsmKey} geography={geo} />
                        ))
                    }
                </Geographies>
            </ComposableMap>
        </CustomContainer>
    );
};
