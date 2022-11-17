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
  height: auto;
  padding: 0 !important;

  ${({ theme: { border, background } }) => css`
    border-radius: ${border.radius};
    box-shadow: 0px 1px 7px rgba(0,0,0, .15);
    & > .MuiBox-root {
      flex: 1;
      &:nth-child(1) {
        background: ${background.color.main};
        position: relative;
        img {
          width: 85%;
          height: 85%;
          position: absolute;
          right: 0;
          bottom: 0;
          object-fit: cover;
        }
      }

      &:nth-child(2) {
        box-sizing: border-box;
        padding: 0 15px;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        margin: 150px 0;
      }
    }
  `}
`;
