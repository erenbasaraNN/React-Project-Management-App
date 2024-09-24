// src/components/layouts/AppLayout.tsx

import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import styles from './AppLayout.module.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { clearUser } from '../../store/slices/userSlice';

// Define the props for AppLayout to include children
interface AppLayoutProps {
    children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleLogout = async () => {
        await signOut(auth);
        dispatch(clearUser());
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link to="/dashboard" className={styles.logo}>
                    Project Management App
                </Link>
                <nav className={styles.nav}>
                    <button onClick={handleLogout} className={styles.navButton}>
                        Logout
                    </button>
                </nav>
            </header>
            <main className={styles.main}>{children}</main>
        </div>
    );
};

export default AppLayout;
