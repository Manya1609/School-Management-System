import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

// const hardcodedUsers = [
//     { username: 'admin', password: '1234', role: 'admin', name: 'John Doe' },
//     { username: 'student', password: '1234', role: 'student', name: 'Jane Smith' },
//     { username: 'superadmin', password: '1234', role: 'superadmin', name: 'Alice Johnson' },
//     { username: 'teacher', password: '1234', role: 'teacher', name: 'Lisa S' }
    
// ];

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [basicRole, setBasicRole] = useState(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(null);

    function setUserDetails(data) {
        let roleStr = data?.role?.toLowerCase();
        if (!roleStr) return;
        setUser(data);
        setBasicRole(roleStr.includes("admin") ? "admin" : roleStr);
        setIsSuperAdmin(roleStr.includes("super"));
    }

    useEffect(() => {
        // Retrieve user from local storage if available
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const {userData,authToken} = JSON.parse(storedUser);
            setUserDetails(userData);
            setToken(authToken);
        }
        setLoading(false);
    }, []);

    const login = async (username, password, remember = true) => {
        // Validate login details against hardcoded users
        try{
            const url = `http://localhost:${process.env.REACT_APP_DBPORT}/api/auth/login`
            let response = await axios.post(url,{username,password});
            const authToken = response.headers.getAuthorization().split(' ',2)[1];
            const userData = response.data;
            // Store user data in state and local storage
            if(remember) localStorage.setItem('user', JSON.stringify({userData,authToken}));
            setUserDetails(userData);
            setToken(authToken);
            window.location.assign('/dashboard'); // Redirect to dashboard or any other page
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
    };

    const logout = () => {
        // Clear user data from state and local storage
        setUser(null);
        localStorage.removeItem('user');
        window.location.assign('/login'); // Redirect to login page
    };

    return (
        <AuthContext.Provider value={{ user, token, basicRole, isSuperAdmin, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return React.useContext(AuthContext);
};