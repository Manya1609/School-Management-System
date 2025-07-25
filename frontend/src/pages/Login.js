import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Alert from '@mui/material/Alert';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [alert, setAlert] = useState({ visible: false, message: '', severity: '' });
  const { login } = useAuth();
  // const navigate = useNavigate();

  useEffect(() => {
    if (alert.visible) {
      const timer = setTimeout(() => {
        setAlert({ visible: false, message: '', severity: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      setAlert({ visible: true, message: 'Login successful!', severity: 'success' });
      // navigate('/dashboard'); // redirect to the dashboard after successful login
    } else {
      setAlert({ visible: true, message: 'Invalid username or password', severity: 'error' });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-200 p-4">
      <div className='fixed bottom-[2vh]'>{alert.visible && <Alert severity={alert.severity}>{alert.message}</Alert>}</div>
      
      <h1 className="text-4xl font-bold text-black mb-8">School Management System</h1>
      
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-30 backdrop-blur-md p-6 rounded-lg shadow-lg w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor='login-username' className="block text-gray-700 mb-2">Username:</label>
          <input
            id='login-username'
            type="text"
            name='username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor='login-password' className="block text-gray-700 mb-2">Password:</label>
          <input
            id='login-password'
            type="password"
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center text-gray-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            Remember me
          </label>
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;