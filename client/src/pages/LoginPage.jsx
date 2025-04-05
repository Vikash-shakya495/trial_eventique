import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios'
import logo from '../assets/logo1.png';
import useUserStore from '../store'
import signinpic from "../assets/signinpic.svg"

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [redirect, setRedirect] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const setUser = useUserStore((state) => state.setUser)
  const [errorMessage, setErrorMessage] = useState('');

  //! Fetch users from the server --------------------------------------------------------------
  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    const storedPass = localStorage.getItem('rememberedpass')
    if (storedEmail) {
      setEmail(storedEmail);
      setPassword(storedPass);
    }
  }, []);


  async function loginUser(ev){
      ev.preventDefault();

      try{
        const {data} = await axios.post('/login', {email, password})
        setUser(data);
        alert('Login success');

        if (rememberMe) {
          // If the user checked, store their email in localStorage.
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedpass', password);
        } else {
          // If the user didnt checked, remove their email from localStorage.
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedpass');
        }

        setRedirect(true)
      }catch(ev){
        alert('Login failed',ev);
      }
  }

  if(redirect){
    return <Navigate to={'/'}/>
  }
  
  return (
    <div className="flex w-full h-screen px-10  justify-between items-center overflow-hidden bg-slate-900 text-white">
      <div className="bg-gray-800 w-full sm:w-full md:w-1/2 lg:w-1/3 px-7 py-7 rounded-xl shadow-lg">
        <form className="flex flex-col w-auto items-center" onSubmit={loginUser}>
          <h1 className="px-3 font-extrabold mb-5 text-orange-500 text-2xl">Sign In</h1>
          <div className="input flex items-center w-full bg-gray-900 text-black px-3 py-2 rounded-lg mb-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full bg-transparent border-none outline-none "
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </div>
          <div className="input flex items-center w-full bg-gray-900 text-black px-3 py-2 rounded-lg mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full bg-transparent border-none outline-none "
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
            />
            <button type="button" className="text-orange-500" onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          <div className="flex w-full justify-between px-1 text-sm text-gray-300">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe((prev) => !prev)} />
              Remember Me
            </label>
            <Link to="/forgotpassword" className="text-orange-500">Forgot Password?</Link>
          </div>
          <div className="w-full py-4">
            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded-lg">Sign in</button>
          </div>
          <div className="flex gap-2 w-full">
            <Link to="/login" className="w-1/2">
              <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 rounded-lg">Sign In</button>
            </Link>
            <Link to="/register" className="w-1/2">
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-lg">Sign Up</button>
            </Link>
          </div>
          <Link to="/" className="mt-4 text-orange-500">⬅ Back</Link>
        </form>
      </div>
      <div className="hidden lg:flex flex-col right-box text-white">
        <div className="flex flex-col -ml-96 gap-3">
          <div className="text-3xl font-black text-blue-400">Welcome to</div>
          <img src={logo} alt="Logo" className="w-48" />
        </div>
        <div className="-ml-48 w-80 mt-12">
          <img src={signinpic} alt="Sign In Illustration" className="w-full" />
        </div>
      </div>
    </div>
  )
}
