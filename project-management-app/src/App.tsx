// src/App.tsx

import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import PrivateRoute from './components/PrivateRoute';

import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser, clearUser } from './store/slices/userSlice';
import { AppDispatch } from './store/store';

const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(
                    setUser({
                        uid: user.uid,
                        email: user.email,
                    })
                );
            } else {
                dispatch(clearUser());
            }
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [dispatch]);

    return (
        <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route
                path='/dashboard'
                element={
                    <PrivateRoute>
                        <DashboardPage />
                    </PrivateRoute>
                }
            />
            <Route
                path='/projects/:id'
                element={
                    <PrivateRoute>
                        <ProjectDetailsPage />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default App;
