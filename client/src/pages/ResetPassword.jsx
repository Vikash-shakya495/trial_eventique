import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/auth/reset-password/${token}`, { password });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className="flex w-full h-full px-10 py-10 justify-center place-items-center mt-20">
      <div className="bg-white w-1/3 px-7 py-7 rounded-xl">
        <form className="flex flex-col w-auto items-center" onSubmit={handleSubmit}>
          <h1 className='px-3 font-extrabold mb-5 text-primarydark text-2xl'>Reset Password</h1>
          {message && <p className="text-red-500">{message}</p>}
          <div className="input">
            <input
              type="password"
              placeholder="New Password"
              className="input-et"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="w-full py-4">
            <button type="submit" className="primary w-full">Reset Password</button>
          </div>
        </form>
      </div>
    </div>
  );
}