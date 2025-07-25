import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ element, roles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // You can replace this with a loading spinner or any other loading indicator
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    const userRole = user.role.toLowerCase();
    const normalizedRoles = roles.map(role => role.toLowerCase());

    if (roles && !normalizedRoles.includes(userRole)) {
        return <Navigate to="/login" />;
    }

    return element;
};

export default PrivateRoute;