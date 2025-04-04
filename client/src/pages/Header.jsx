import { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { BsFillCaretDownFill } from 'react-icons/bs';
import useUserStore from "../store";
import logo from '../assets/logo1.png';

export default function Header() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [userRole, setUserRole] = useState(null);
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      axios.get("/profile")
        .then((response) => {
          setUserRole(response.data.role);  // role extract करके state में सेट करें
        })
        .catch((err) => {
          console.error("Error in fetching user profile", err);
        });
    }
  }, [user]); // Dependency में user रखा ताकि update होने पर render हो

  async function logout() {
    await axios.post('/logout');
    setUser(null);
    navigate('/');
  }

  return (
    <header className="bg-slate-900 text-white flex py-3 px-6 sm:px-10 justify-between items-center shadow-lg">
      <Link to="/" className="flex items-center">
        <img src={logo} alt="Logo" className="w-24 h-20" />
      </Link>

      {/* Large Screen Navigation */}
      <div className="hidden md:flex items-center gap-6">
        {user && userRole && (
          <>
            <Link to={`/${userRole}/dashboard`} className="px-4 py-2 bg-blue-600 hover:bg-orange-500 text-white rounded-md transition-all">
              Dashboard
            </Link>
            <Link to="/wallet" className="px-4 py-2 bg-blue-600 hover:bg-orange-500 text-white rounded-md transition-all">
              Wallet
            </Link>
            <Link to="/calendar" className="px-4 py-2 bg-blue-600 hover:bg-orange-500 text-white rounded-md transition-all">
              Calendar
            </Link>
            <Link to="/useraccount" className="text-white font-semibold">
              {user.name?.toUpperCase()}
            </Link>
            <button onClick={logout} className="px-3 py-2 bg-red-600 hover:bg-orange-500 text-white rounded-md">
              Log out
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden flex items-center gap-4">
        {user && (
          <div className="relative">
            <button className="text-white font-semibold flex items-center" onClick={() => setisMenuOpen(!isMenuOpen)}>
              {user.name?.toUpperCase()}
              <BsFillCaretDownFill className="w-5 h-5 ml-2 transition-transform duration-300" style={{ transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-12 w-48 bg-slate-800 text-white rounded-lg shadow-lg z-50">
                <nav className="flex flex-col p-4">
                  {userRole && <Link to={`/${userRole}/dashboard`} className="hover:bg-blue-600 p-2 rounded-md">Dashboard</Link>}
                  <Link to="/wallet" className="hover:bg-blue-600 p-2 rounded-md">Wallet</Link>
                  <Link to="/calendar" className="hover:bg-blue-600 p-2 rounded-md">Calendar</Link>
                  <button onClick={logout} className="hover:bg-red-600 p-2 rounded-md">Log out</button>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
