import { createTheme } from '@mui/material';
import { blue } from '@mui/material/colors';

const defaultTheme = createTheme({
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          position: 'relative',
        },
      },
    },
  },
  border: {
    radius: '14px',
  },
  background: {
    color: {
      main: '#839bc0',
      // main: 'rgba(188, 209, 220,1)',
      sub: '',
    },
  },
  palette: {
    primary: {
      light: blue[300],
      main: "#839bc0",
      dark: "rgb(118,146,175)",
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default defaultTheme;

export { darkTheme, lightTheme };
