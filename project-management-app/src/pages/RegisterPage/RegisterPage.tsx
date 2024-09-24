// src/pages/RegisterPage/RegisterPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../../services/firebase';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/userSlice';
import { AppDispatch } from '../../store/store';

import styles from './RegisterPage.module.css';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            dispatch(
                setUser({
                    uid: userCredential.user.uid,
                    email: userCredential.user.email,
                })
            );
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration Error:', error);
            // Handle error
        }
    };

    return (
        <div className={styles.container}>
            <h2>Register</h2>
            <form onSubmit={handleRegister} className={styles.form}>
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
                <Button type="submit">Register</Button>
            </form>
            <p>
                Already have an account? <a href="/">Login here</a>
            </p>
        </div>
    );
};

export default RegisterPage;
