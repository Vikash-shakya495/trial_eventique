import { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/logo1.png'
import { RxExit } from 'react-icons/rx';
import { BsFillCaretDownFill } from 'react-icons/bs';
import useUserStore from "../store";


export default function Header() {
  // const {user,setUser} = useContext(UserContext);
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const [userRole, setUserRole] = useState();
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef();
  const navigate = useNavigate();

  //! Fetch events from the server -------------------------------------------------
  useEffect(() => {

    axios.get("/profile").then((response) => {
      setUserRole(response.data);
      // console.log(response.data);
    }).catch((err) => {
      console.error("Error in fetching user profile", err);
    })


    axios.get("/events").then((response) => {
      setEvents(response.data);
    }).catch((error) => {
      console.error("Error fetching events:", error);
    });
  }, []);



  //! Logout Function --------------------------------------------------------
  async function logout() {
    await axios.post('/logout');
    setUser(null);
    navigate('/');
  }
  //! Search input ----------------------------------------------------------------
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <header className="bg-slate-900 text-white flex py-3 px-6 sm:px-10 justify-between items-center shadow-lg">
  <Link to="/" className="flex items-center">
    <img src={logo} alt="Logo" className="w-24 h-20" />
  </Link>

  {/* Large Screen Navigation */}
  <div className="hidden md:flex items-center gap-6">
    {/* Role-Based Navigation */}
    {user && userRole?.role === 'user' && (
      <Link to="/dashboard" className="px-4 py-2 bg-blue-600 hover:bg-orange-500 text-white rounded-md transition-all">Dashboard</Link>
    )}
    {user && userRole?.role === 'organizer' && (
      <Link to="/organizer/dashboard" className="px-4 py-2 bg-blue-600 hover:bg-orange-500 text-white rounded-md transition-all">Organizer Dashboard</Link>
    )}
    {user && userRole?.role === 'admin' && (
      <Link to="/admin/dashboard" className="px-4 py-2 bg-red-600 hover:bg-orange-500 text-white rounded-md transition-all">Admin Dashboard</Link>
    )}

    {/* Navigation Icons */}
    <Link to="/wallet" className="flex flex-col items-center py-1 px-3 rounded-md hover:text-orange-400 transition">
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M21 12a2.25 2.25..." />
      </svg>
      <div>Wallet</div>
    </Link>
    
    <Link to="/calendar" className="flex flex-col items-center py-1 px-3 rounded-md hover:text-orange-400 transition">
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6.75 2.25A.75..." />
      </svg>
      <div>Calendar</div>
    </Link>

    {/* User Info & Logout */}
    {!!user && (
      <div className="flex items-center gap-4">
        <Link to="/useraccount" className="text-white font-semibold">{user.name.toUpperCase()}</Link>
        <button onClick={logout} className="px-3 py-2 bg-red-600 hover:bg-orange-500 text-white rounded-md">
          Log out
        </button>
      </div>
    )}
  </div>

  {/* Mobile Screen - Show Only Name with Dropdown */}
  <div className="md:hidden flex items-center gap-4">
    {!!user && (
      <div className="flex items-center">
        <Link to="/useraccount" className="text-white font-semibold">{user.name.toUpperCase()}</Link>
        <BsFillCaretDownFill
          className="w-5 h-5 cursor-pointer hover:rotate-180 transition-all"
          onClick={() => setisMenuOpen(!isMenuOpen)}
        />
      </div>
    )}
  </div>

  {/* Mobile Menu Dropdown */}
  {isMenuOpen && (
    <div className="md:hidden absolute z-10 right-4 top-14 w-48 bg-slate-800 text-white rounded-lg shadow-lg">
      <nav className="flex flex-col p-4">
        {userRole?.role === 'user' && <Link to="/dashboard" className="hover:bg-blue-600 p-2 rounded-md">Dashboard</Link>}
        {userRole?.role === 'organizer' && <Link to="/organizer/dashboard" className="hover:bg-blue-600 p-2 rounded-md">Organizer Dashboard</Link>}
        {userRole?.role === 'admin' && <Link to="/admin/dashboard" className="hover:bg-red-600 p-2 rounded-md">Admin Dashboard</Link>}
        <Link to="/wallet" className="hover:bg-blue-600 p-2 rounded-md">Wallet</Link>
        <Link to="/calendar" className="hover:bg-blue-600 p-2 rounded-md">Calendar</Link>
        <button onClick={logout} className="hover:bg-red-600 p-2 rounded-md">Log out</button>
      </nav>
    </div>
  )}
</header>

  
  )
}
