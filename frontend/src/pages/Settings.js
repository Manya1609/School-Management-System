import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
    const { user } = useAuth();
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (user) {
            setUserInfo(user);
        }
    }, [user]);

    if (!userInfo) {
        return <div className="flex justify-center items-center h-screen">
            <div className="text-xl font-semibold">Loading...</div>
        </div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                <p className="text-gray-900">{userInfo.name}</p>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                <p className="text-gray-900">{userInfo.email}</p>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
                <p className="text-gray-900">{userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1)}</p>
            </div>
            {/* Add more user info fields here */}
            <div className="mt-6">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Settings;