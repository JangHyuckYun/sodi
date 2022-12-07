import { Container, css, styled } from '@mui/material';

export const CustomFlexContainer = styled(Container)`
  position: relative;
  height: 100%;
`;

export const CustomBothSidesContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  background: white;
  min-height: 50%;
  max-height: 84%;
  height: auto;
  padding: 0 !important;

  ${({ theme: { border, background } }) => css`
    border-radius: ${border.radius};
    box-shadow: 0px 1px 7px rgba(0,0,0, .15);
    & > .MuiBox-root {
      flex: 1;
      &.leftBox {
        background: ${background.color.main};
        position: relative;
        box-shadow: 0 0 9px rgba(0,0,0, 0.5);
        img {
          width: 100%;
          height: 100%;
          position: absolute;
          right: 0;
          bottom: 0;
          object-fit: cover;
        }
      }

      &.rightBox {
        box-sizing: border-box;
        padding: 0 20px 0 0px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        //margin: 100px 0;
        
        h4 {
          display: inline-block;
          left: 50%;
          position: relative;
          transform: translateX(-50%);
          margin: 75px 0 50px 0;
          font-weight: bold;
        }
        
      }
    }
  `}
`;
