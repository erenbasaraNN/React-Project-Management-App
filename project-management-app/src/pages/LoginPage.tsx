// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth } from '../services/firebase';

import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/userSlice';
import { AppDispatch } from '../store/store';

import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Link,
} from '@mui/material';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential: UserCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            dispatch(
                setUser({
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                })
            );
            navigate('/dashboard');
        } catch (error) {
            console.error('Login Error:', error);
            // Handle error
        }
    };

    return (
        <Container maxWidth='xs'>
            <Box sx={{ mt: 8 }}>
                <Typography variant='h4' component='h1' gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        label='Email'
                        variant='outlined'
                        fullWidth
                        margin='normal'
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label='Password'
                        variant='outlined'
                        fullWidth
                        margin='normal'
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Login
                    </Button>
                </form>
                <Typography variant='body2' align='center' sx={{ mt: 2 }}>
                    Don't have an account?{' '}
                    <Link component={RouterLink} to='/register'>
                        Register
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default LoginPage;
