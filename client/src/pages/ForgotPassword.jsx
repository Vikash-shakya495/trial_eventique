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
        <div className="flex w-full h-full px-10 py-10 justify-center place-items-center mt-20">
            <div className="bg-white w-1/3 px-7 py-7 rounded-xl">
                {stage === 'request' && (
                    <form className="flex flex-col w-auto items-center" onSubmit={handleRequestOtp}>
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