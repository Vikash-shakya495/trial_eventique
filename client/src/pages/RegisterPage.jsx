import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import logo from '../assets/logo1.png'
import signuppic from '../assets/signuppic.svg'

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [redirect, setRedirect] = useState('');

  async function registerUser (ev) {
    ev.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      console.log("Registering user with data:", { name, email, password, role }); // Log the data
      await axios.post('/register', {
        name,
        email,
        password,
        role, // Include role in the registration request
      });
      alert('Registration Successful');
      setRedirect(true);
    } catch (e) {
      console.error("Registration Error", e.response?.data || e.message); // Log the error
      alert('Registration failed: ' + (e.response?.data?.error || 'Unknown error'));
    }
  }

  if (redirect) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div className="flex w-full  h-screen px-10 py-10 justify-between items-center bg-white text-white">
    {/* Left Section */}
    <div className="hidden lg:flex flex-col">
      <div className="flex flex-col gap-3">
        <div className="text-3xl font-black text-orange-500">Welcome to</div>
        <div>
          <img src={logo} alt="logo" className="w-48" />
        </div>
      </div>
      <div className="ml-48 w-80 mt-6">
        <img src={signuppic} alt="signup" className="w-full rounded-lg shadow-lg" />
      </div>
    </div>
    
    {/* Right Section - Form */}
    <div className="bg-gray-200 text-white w-full sm:w-full md:w-1/2 lg:w-1/3 px-7 py-7 rounded-xl shadow-lg">
      <form className="flex flex-col w-auto items-center" onSubmit={registerUser}>
        <h1 className='px-3 font-extrabold mb-5 text-blue-400 text-2xl'>Sign Up</h1>

        <input type="text" placeholder="Name" className="input-et p-4 m-1 rounded-2xl bg-gray-200 text-white border border-gray-600" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" className="input-et p-4 m-1 rounded-2xl bg-gray-200 text-white border border-gray-600" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="input-et p-4 m-1 rounded-2xl bg-gray-200 text-white border border-gray-600" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input type="password" placeholder="Confirm password" className="input-et p-4 m-1 rounded-2xl bg-gray-200 text-white border border-gray-600" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

        {/* Role Selection */}
        <select value={role} onChange={(e) => setRole(e.target.value)} className="input-et p-2 m-1 bg-gray-700 text-white border border-gray-600">
          <option value="user">User</option>
          <option value="organizer">Organizer</option>
          <option value="admin">Admin</option>
        </select>

        <div className="w-full py-4">
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded">Create Account</button>
        </div>

        <div className="flex gap-2 w-full">
          <Link to={'/login'} className="w-1/2">
            <button type="button" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 w-full rounded">Sign In</button>
          </Link>
          <Link to={'/register'} className="w-1/2">
            <button type="button" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 w-full rounded">Sign Up</button>
          </Link>
        </div>
        
        <Link to={'/'} className="mt-4">
          <button className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">Back</button>
        </Link>
      </form>
    </div>
  </div>
  );
}