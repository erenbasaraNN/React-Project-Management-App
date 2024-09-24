// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth } from '../services/firebase';
import { TextField, Button, Container, Typography } from "@mui/material";

import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/userSlice';
import { AppDispatch } from '../store/store';
import styles from "../assets/styles/LoginPage.module.css";


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
            // Dispatch the setUser action to update the Redux store
            dispatch(
                setUser({
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                })
            );
            navigate('/dashboard');
        } catch (error) {
            console.error('Login Error:', error);
            // Optionally, handle login errors (e.g., display an error message)
        }
    };

    return (
        <div className={styles.container}>
            <Container maxWidth="sm">
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Login
                    </Button>
                </form>
            </Container>
        </div>
            );
};

export default LoginPage;
