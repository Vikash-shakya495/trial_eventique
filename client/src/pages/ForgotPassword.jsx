import React, { useState } from 'react';
import axios from 'axios';
import VerifyOtp from './VerifyOtp'; // Import the VerifyOtp component
import ResetPassword from './ResetPassword'; // Import the ResetPassword component

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [stage, setStage] = useState('request'); // 'request', 'verify', 'reset'

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/forgot-password', { email });
            setMessage(response.data.message);
            setStage('verify'); // Move to OTP verification stage
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div className="flex w-screen h-screen px-10 py-10 justify-center items-center bg-slate-900">
        <div className="bg-white w-1/3 px-7 py-7 rounded-xl shadow-lg border border-gray-300">
            {stage === 'request' && (
                <form className="flex flex-col w-auto items-center" onSubmit={handleRequestOtp}>
                    <h1 className='px-3 font-extrabold mb-5 text-darkblue text-2xl'>Forgot Password</h1>
                    {message && <p className="text-green-500">{message}</p>}
                    <div className="input w-full">
                        <input
                            type="email"
                            placeholder="Email"
                            className="input-et border border-gray-400 px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="w-full py-4">
                        <button type="submit" className="bg-orange-500 text-white font-bold py-2 px-4 rounded w-full hover:bg-orange-600 transition duration-200">Submit</button>
                    </div>
                </form>
            )}
    
            {stage === 'verify' && (
                <VerifyOtp email={email} setStage={setStage} />
            )}
    
            {stage === 'reset' && (
                <ResetPassword email={email} />
            )}
        </div>
    </div>
    
    );
}