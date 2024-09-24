// src/theme.ts

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Primary color
        },
        secondary: {
            main: '#dc004e', // Secondary color
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        // Customize typography here
    },
});

export default theme;
