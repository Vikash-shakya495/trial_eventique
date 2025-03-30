import { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
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
    <div>
      <header className='flex py-2 px-6 sm:px-6 justify-between place-items-center'>

        <Link to={'/'} className="flex item-center ">
          <img src="../src/assets/logo1.png" alt="" className='w-26 h-24' />
        </Link>
        {/* <div className='flex  rounded py-2.5 px-4 w-1/3 gap-4 items-center '>

          <button>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
          <div ref={searchInputRef}>
            <input type="text" placeholder="Search" value={searchQuery} onChange={handleSearchInputChange} className='text-sm text-black outline-none w-full ' />
          </div>
          {/* <div className='text-sm text-gray-300 font-semibold'>Search</div> */}
        {/* </div> */} 


        {/* Conditional Rendering Based on User Role */}
        {user && userRole?.role === 'user' && (
          <Link to={'/dashboard'}>
            <button className="primary">Dashboard</button>
          </Link>
        )}

        {/* {user && userRole.} */}
        {user && userRole?.role === 'organizer' && (
          <Link to={'/organizer/dashboard'}>
            <button className="primary">Organizer Dashboard</button>
          </Link>
        )}

        {user && userRole?.role === 'admin' && (
          <Link to={'/admin/dashboard'}>
            <button className="primary">Admin Dashboard</button>
          </Link>
        )}


        <div className='hidden lg:flex gap-5 text-sm'>
          <Link to={'/wallet'}> {/*TODO:Route wallet page after creating it */}
            <div className='flex flex-col place-items-center py-1 px-3 rounded cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 py-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
              </svg>
              <div>Wallet</div>
            </div >
          </Link>


          <Link to={'/calendar'}> {/*TODO:Route calendar page after creating it */}
            <div className='flex flex-col place-items-center py-1 px-3 rounded cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 py-1">
                <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
              </svg>
              <div>Calendar</div>
            </div>
          </Link>
        </div>


        <div>
          <div className='flex flex-col place-items-center py-1 px-3 rounded cursor-pointer hover:text-primarydark hover:bg-white hover:shadow-sm shadow-gray-200 hover:transition-shadow duration-1500'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 py-1">
              <path fillRule="evenodd" d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z" clipRule="evenodd" />
            </svg>

          </div>
        </div>

        {/* -------------------IF user is Logged DO this Main-------------------- */}
        {!!user && (

          <div className="flex flex-row items-center gap-2 sm:gap-8 ">
            <div className="flex items-center gap-2">
              <Link to={'/useraccount'}>  {/*TODO: Route user profile page after creating it -> 1.50*/}
                {user.name.toUpperCase()}
              </Link>

              <BsFillCaretDownFill className="h-5 w-5 cursor-pointer hover:rotate-180 transition-all" onClick={() => setisMenuOpen(!isMenuOpen)} />
            </div>
            <div className="hidden md:flex">
              <button onClick={logout} className="secondary">
                <div>Log out</div>
                <RxExit />
              </button>
            </div>
          </div>
        )}

        {/* -------------------IF user is not Logged in DO this MAIN AND MOBILE-------------------- */}
        {!user && (
          <div>

            <Link to={'/login'} className=" ">
              <button className="primary">
                <div>Sign in </div>
              </button>
            </Link>
          </div>
        )}

        {/* -------------------IF user is Logged DO this Mobile -------------------- */}
        {!!user && (
          //w-auto flex flex-col absolute bg-white pl-2 pr-6 py-5 gap-4 rounded-xl
          <div className="absolute z-10 mt-64 flex flex-col w-48 bg-white right-2 md:right-[160px] rounded-lg shadow-lg">
            {/* TODO: */}
            <nav className={`block ${isMenuOpen ? 'block' : 'hidden'} `}>
              <div className="flex flex-col font-semibold text-[16px]">
                {user && userRole?.role === 'organizer' && (
                  <Link to={'/createEvent'}>
                    <button className="primary">Create Event</button>
                  </Link>
                )}

                {user && userRole?.role === 'user' && (
                  <Link to={'/dashboard'}>
                    <button className="primary">Dashboard</button>
                  </Link>
                )}



                {user && userRole?.role === 'admin' && (
                  <Link to={'/admin/dashboard'}>
                    <button className="primary">Admin Dashboard</button>
                  </Link>
                )}


                <Link className="flex hover:bg-background hover:shadow py-2 pl-6 pr-8 rounded-lg" to={'/wallet'}>
                  <div>Wallet</div>
                </Link>

    

                <Link className="flex hover:bg-background hover:shadow py-2 pl-6 pr-8 rounded-lg" to={'/calendar'}>
                  <div>Calendar</div>
                </Link>

                <Link className="flex hover:bg-background hover:shadow py-2 pl-6 pb-3 pr-8 rounded-lg" onClick={logout}>
                  Log out
                </Link>
              </div>
            </nav>
          </div>
        )}

      </header>

    </div>
  )
}
