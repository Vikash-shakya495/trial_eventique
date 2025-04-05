import { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/logo1.png';
import { RxExit } from 'react-icons/rx';
import { BsFillCaretDownFill } from 'react-icons/bs';
import useUserStore from "../store";

export default function Header() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  // // Fetch user role from the server
  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      if (!token) {
        console.error("No token found");
        // navigate('/login'); // Redirect to login if no token
        return;
      }


        try {
          const response = await axios.get("/profile", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const role = response?.data?.role;
          if (role) {
            setUserRole(role);
            console.log("User  Role Fetched:", role);
          } else {
            console.warn("Role not found in response", response.data);
            setUserRole(null);
          }
        } catch (err) {
          console.error("Error in fetching user profile", err.response ? err.response.data : err);
          if (err.response && err.response.status === 401) {
            setUser (null); // Clear user state
            navigate('/login'); // Redirect to login
          }
        }
    
    };

    fetchUserRole();
  }, [user, navigate, setUser ]);


  // Logout Function
  async function logout() {
    await axios.post('/logout');
    setUser(null);
    localStorage.removeItem('authToken');
    navigate('/');
  }

  return (
    <header className="bg-slate-900 text-white flex py-3 px-6 sm:px-10 justify-between items-center shadow-lg">
      <Link to="/" className="flex items-center">
        <img src={logo} alt="Logo" className="w-24 h-20 " />
      </Link>

      {/* Role-Based Navigation */}
      {user && userRole ? (
        <>
          {userRole === 'user' && (
            <Link to="/dashboard">
              <button className="px-4 py-2 bg-blue-600 hidden sm:block hover:bg-orange-500 text-white rounded-md transition-all">
                Dashboard
              </button>
            </Link>
          )}
          {userRole === 'organizer' && (
            <Link to="/organizer/dashboard">
              <button className="px-4 py-2 bg-blue-600 hidden sm:block hover:bg-orange-500 text-white rounded-md transition-all">
                Organizer Dashboard
              </button>
            </Link>
          )}
          {userRole === 'admin' && (
            <Link to="/admin/dashboard">
              <button className="px-4 py-2 bg-red-600 hidden sm:block hover:bg-orange-500 text-white rounded-md transition-all">
                Admin Dashboard
              </button>
            </Link>
          )}
        </>
      ) : null}

      {/* Navigation Icons (Available for all users) */}
      <div className="hidden lg:flex gap-6 text-sm">
        <Link to="/wallet" className="flex flex-col items-center py-1 px-3 rounded-md hover:text-orange-400 transition">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M21 12a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 12V6.75A2.25 2.25 0 016.75 4.5h12.5A2.25 2.25 0 0121 6.75v5.25z" />
          </svg>
          <div>Wallet</div>
        </Link>

        <Link to="/calendar" className="flex flex-col items-center py-1 px-3 rounded-md hover:text-orange-400 transition">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.75 2.25A.75.75 0 006 3v1.5H3.75A.75.75 0 003 6v12a.75.75 0 00.75.75H6v1.5a.75.75 0 001.5 0V18h9v1.5a.75.75 0 001.5 0V18h2.25a.75.75 0 00.75-.75V6a.75.75 0 00-.75-.75H18V3a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v1.5H9V3a.75.75 0 00-.75-.75H6.75z" />
          </svg>
          <div>Calendar</div>
        </Link>
      </div>

      {/* User Info & Logout */}
      {!!user ? (
        <div className="flex items-center gap-4 ">
          {!!user?.name && (
            <Link to="/useraccount" className="text-white font-semibold">
              {user.name.toUpperCase()}
            </Link>
          )}
          {/* <Link to="/useraccount" className="text-white font-semibold">{user.name.toUpperCase()}</Link> */}
          {/* <BsFillCaretDownFill className="w-5 h-5 cursor-pointer hover:rotate-180 transition-all" onClick={() => setIsMenuOpen(!isMenuOpen)} /> */}
          <BsFillCaretDownFill
            className={`w-5 h-5 cursor-pointer transform transition-transform ${isMenuOpen ? "rotate-180" : ""
              }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          <button onClick={logout} className="sm:flex hidden px-3 py-2 bg-red-600 hover:bg-orange-500 text-white rounded-md items-center gap-2">
            Log out <RxExit />
          </button>
        </div>
      ) : (
        <Link to="/login">
          <button className="px-4 py-2 bg-blue-600 hover:bg-orange-500 text-white rounded-md transition-all">Sign in</button>
        </Link>
      )}

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden absolute z-50 right-4 sm:right-36 top-0 mt-20 w-48 bg-slate-800 text-white rounded-lg shadow-lg">
          <nav className="flex flex-col p-4">
            {userRole === 'organizer' && <Link to="/createEvent" className="hover:bg-blue-600 p-2 rounded-md">Create Event</Link>}
            {userRole === 'user' && <Link to="/dashboard" className="hover:bg-blue-600 p-2 rounded-md">Dashboard</Link>}
            {userRole === 'admin' && <Link to="/admin/dashboard" className="hover:bg-blue-600 p-2 rounded-md">Admin Dashboard</Link>}
            <Link to="/wallet" className="hover:bg-blue-600 p-2 rounded-md">Wallet</Link>
            <Link to="/calendar" className="hover:bg-blue-600 p-2 rounded-md">Calendar</Link>
            <button onClick={logout} className="hover:bg-red-600 p-2 rounded-md">Log out</button>
          </nav>
        </div>
      )}
    </header>
  );
}