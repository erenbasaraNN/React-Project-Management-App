// src/components/layouts/AppLayout.tsx

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { clearUser } from '../../store/slices/userSlice';
import Sidebar from '../Sidebar/Sidebar';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleLogout = async () => {
        await signOut(auth);
        dispatch(clearUser());
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography
                            variant="h6"
                            component={RouterLink}
                            to="/dashboard"
                            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
                        >
                            Project Management App
                        </Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Toolbar>
                </AppBar>
                <Toolbar />
                <Container sx={{ mt: 4 }}>{children}</Container>
            </Box>
        </Box>
    );
};

export default AppLayout;
