// src/App.tsx

import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from './services/firebase';
import { setUser, clearUser } from './store/slices/userSlice';
import { AppDispatch } from './store/store';

import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage/ProjectDetailsPage';
import PrivateRoute from './components/PrivateRoute';

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

        return () => unsubscribe();
    }, [dispatch]);

    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <DashboardPage />
                    </PrivateRoute>
                }
            />
            <Route
                path="/projects/:id"
                element={
                    <PrivateRoute>
                        <ProjectDetailsPage />
                    </PrivateRoute>
                }
            />
            {/* Add additional routes as needed */}
        </Routes>
    );
};

export default App;
