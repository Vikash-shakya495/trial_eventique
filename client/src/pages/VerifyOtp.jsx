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
        <div>
            <h1>Verify OTP</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <button type="submit">Verify OTP</button>
            </form>
        </div>
    );
}