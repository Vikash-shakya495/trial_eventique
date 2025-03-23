import React, { useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className="flex w-full h-full px-10 py-10 justify-center place-items-center mt-20">
      <div className="bg-white w-1/3 px-7 py-7 rounded-xl">
        <form className="flex flex-col w-auto items-center" onSubmit={handleSubmit}>
          <h1 className='px-3 font-extrabold mb-5 text-primarydark text-2xl'>Forgot Password</h1>
          {message && <p className="text-green-500">{message}</p>}
          <div className="input">
            <input
              type="email"
              placeholder="Email"
              className="input-et"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="w-full py-4">
            <button type="submit" className="primary w-full">Submit</button>
          </div>
          <Link to={'/login'} className="flex gap-2 items-center text-primary py-2 px-4 bg-primarylight cursor-pointer ring-1 ring-primarylight rounded hover:bg-primarydark hover:shadow-lg duration-75 hover:ring-primarydark hover:text-white">
            <button className="">Back</button>
          </Link>
        </form>
      </div>
    </div>
  );
}