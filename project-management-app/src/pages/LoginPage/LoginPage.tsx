// src/pages/LoginPage/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../services/firebase';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';
import { AppDispatch } from '../../store/store';

import styles from './LoginPage.module.css';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            dispatch(
                setUser({
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                })
            );
            navigate('/dashboard');
        } catch (error) {
            console.error('Login Error:', error);
            // Handle error (e.g., display error message)
        }
    };

    return (
        <div className={styles.container}>
            <h2>Login</h2>
            <form onSubmit={handleLogin} className={styles.form}>
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit">Login</Button>
            </form>
            <p>
                Don't have an account? <a href="/register">Register here</a>
            </p>
        </div>
    );
};

export default LoginPage;
