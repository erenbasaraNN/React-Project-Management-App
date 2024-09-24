// src/components/PrivateRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface PrivateRouteProps {
    children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const user = useSelector((state: RootState) => state.user);

    return user.uid ? children : <Navigate to="/" />;
};

export default PrivateRoute;
