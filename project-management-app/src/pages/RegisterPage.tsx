// src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth } from '../services/firebase';

import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/userSlice';
import { AppDispatch } from '../store/store';

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userCredential: UserCredential = await createUserWithEmailAndPassword(
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
            console.error('Registration Error:', error);
            // Optionally, handle registration errors (e.g., display an error message)
        }
    };

    return (
        <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <input
                type='email'
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type='submit'>Register</button>
        </form>
    );
};

export default RegisterPage;
