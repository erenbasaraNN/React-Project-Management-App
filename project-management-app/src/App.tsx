// src/App.tsx

import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { auth, db } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import { setUser, clearUser } from './store/slices/userSlice';
import { AppDispatch } from './store/store';
import { doc, setDoc } from 'firebase/firestore';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage/ProjectDetailsPage';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Kullanıcı oturum açmış
                dispatch(setUser({ uid: user.uid, displayName: user.displayName || 'Anonim' }));

                // Kullanıcıyı 'users' koleksiyonuna ekle
                const userRef = doc(db, 'users', user.uid);
                await setDoc(
                    userRef,
                    {
                        displayName: user.displayName || 'Anonim',
                        email: user.email,
                    },
                    { merge: true }
                );
            } else {
                // Kullanıcı oturum kapatmış
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
