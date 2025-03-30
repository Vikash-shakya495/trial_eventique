import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

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
    <div className="flex w-full h-full lg:-ml-24 px-10 py-10 justify-between place-items-center mt-12">
      <div className="hidden lg:flex flex-col right-box ">
        <div className="flex flex-col gap-3">
          <div className="text-3xl font-black">Welcome to</div>
          <div>
            <img src="../src/assets/logo1.png" alt="" className="w-48" />
          </div>
        </div>
        <div className="ml-48 w-80 mt-6">
          <img src="../src/assets/signuppic.svg" alt="" className='w-full' />
        </div>
      </div>
      <div className="bg-white w-full sm:w-full md:w-1/2 lg:w-1/3 px-7 py-7 rounded-xl justify-center align-middle ">
        <form className="flex flex-col w-auto items-center" onSubmit={registerUser }>
          <h1 className='px-3 font-extrabold mb-5 text-primarydark text-2xl'>Sign Up</h1>

          <div className="input">
            <input type="text" placeholder="Name" className="input-et" value={name} onChange={ev => setName(ev.target.value)} />
          </div>

          <div className="input">
            <input type="email" placeholder="Email" className="input-et" value={email} onChange={ev => setEmail(ev.target.value)} />
          </div>

          <div className="input">
            <input type="password" placeholder="Password" className="input-et" value={password} onChange={ev => setPassword(ev.target.value)} />
          </div>

          <div className="input">
            <input type="password" placeholder="Confirm password" className="input-et" value={confirmPassword} onChange={ev => setConfirmPassword(ev.target.value)} />
          </div>

          {/* Role Selection */}
          <div className="input">
            <select value={role} onChange={ev => setRole(ev.target.value)} className="input-et">
              <option value="user">User </option>
              <option value="organizer">Organizer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="w-full py-4">
            <button type="submit" className="primary w-full">Create Account</button>
          </div>

          <div className="container2">
            <div className="w-full h-full p-1">
              <Link to={'/login'}>
                <button type="button" className="text-black cursor-pointer rounded w-full h-full font-bold">Sign In</button>
              </Link>
            </div>
            <div className="w-full h-full p-1">
              <Link to={'/register'}>
                <button type="button" className="text-white cursor-pointer rounded w-full h-full bg-primary font-bold">Sign Up</button>
              </Link>
            </div>
          </div>

          <Link to={'/'}>
            <button className="secondary">
              Back
            </button>
          </Link>
        </form >
      </div>
    </div>
  );
}