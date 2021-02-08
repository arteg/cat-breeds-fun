import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#ff9e80',
            light: '#ffd0b0',
            dark: '#c96f53'
        },
        secondary: {
            main: '#bf360c',
            light: '#f9683a',
            dark: '#870000'
        }
    }
});

export { theme };
