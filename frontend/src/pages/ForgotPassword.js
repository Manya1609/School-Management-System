import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Fake API call to simulate password reset
    const response = await fakePasswordResetApi(email);
    if (response.success) {
      setMessage('Password reset link has been sent to your email.');
    } else {
      setMessage('Failed to send password reset link. Please try again.');
    }
  };

  // Fake API function
  const fakePasswordResetApi = async (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'test@example.com') {
          resolve({ success: true });
        } else {
          resolve({ success: false });
        }
      }, 1000);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 p-4">
      <h1 className="text-4xl font-bold text-black mb-8">School Management System</h1>
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-30 backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
          Reset Password
        </button>
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </form>
      <button
        onClick={() => navigate('/login')}
        className="mt-4 text-blue-500 hover:underline"
      >
        Back to Login
      </button>
    </div>
  );
};

export default ForgotPassword;