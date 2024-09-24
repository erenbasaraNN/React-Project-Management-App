// src/theme.ts

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Adjust as needed
        },
        secondary: {
            main: '#e57373', // Adjust as needed
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        // Customize typography here
    },
});

export default theme;
