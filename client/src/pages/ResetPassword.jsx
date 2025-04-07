import React, { useState } from 'react';
import axios from 'axios';
// import { NavLink } from 'react-router-dom'

export default function ResetPassword({ email }) {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/reset-password', { email, otp, password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4 text-center text-orange-500">Reset Password</h1>
        {message && <p className="text-green-500 text-center mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            className="p-2 mb-4 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-2 mb-4 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-700"
          />
          <button
            type="submit"
            className="bg-blue-700 text-white py-2 rounded hover:bg-orange-500 transition duration-200"
          >
            Reset Password
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          Remembered your password?
          <span className="text-orange-400 cursor-pointer hover:underline" onClick={() => setStage('login')}>
     
              Login
        
          </span>
        </p>
      </div>
    </div>

  );
}