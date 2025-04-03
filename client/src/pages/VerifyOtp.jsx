import React, { useState } from 'react';
import axios from 'axios';

export default function VerifyOtp({ email, setStage }) {
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/auth/verify-otp', { email, otp });
            setMessage(response.data.message);
            setStage('reset'); // Move to reset password stage
        } catch (error) {
            setMessage(error.response.data.error);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-slate-900 text-white">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full border border-gray-700">
            <h1 className="text-2xl font-bold mb-4 text-center text-orange-400">Verify OTP</h1>
            {message && <p className="text-green-500 text-center mb-4">{message}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col">
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="p-2 mb-4 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="submit"
                    className="bg-blue-700 text-white py-2 rounded hover:bg-blue-500 transition duration-200 shadow-md"
                >
                    Verify OTP
                </button>
            </form>
            <p className="text-sm text-center mt-4">
                Didn't receive the OTP? <span className="text-orange-400 cursor-pointer hover:text-orange-300">Resend OTP</span>
            </p>
        </div>
    </div>
    
    );
}