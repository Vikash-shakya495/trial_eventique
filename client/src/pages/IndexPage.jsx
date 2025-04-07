import axios from "axios";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import Features from "../components/Features";
import { FaCheckCircle } from "react-icons/fa";
import WhyChooseUs from "../components/WhyChooseUs";


export default function IndexPage() {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");


  //! Fetch events from the server ---------------------------------------------------------------
  useEffect(() => {
    axios
      .get("/createEvent")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  //! Like Functionality --------------------------------------------------------------
  const handleLike = (eventId) => {
    axios
      .post(`/event/${eventId}`)
      .then((response) => {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId
              ? { ...event, likes: event.likes + 1 }
              : event
          )
        );
        console.log("done", response);
      })
      .catch((error) => {
        console.error("Error liking ", error);
      });
  };

  //! Handle Search Input Change --------------------------------------------------------------
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Filter events based on the search query
  const filteredEvents = events
    .filter((event) => event.status === "approved")
    .filter((event) => event.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  console.log(filteredEvents);
  return (
    <>
      <div className="mt-1 flex flex-col">
        {/* Hero Section */}
        <div className="relative sm:block">
          <div className="flex item-center inset-0">
            <img
              src="https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?cs=srgb&dl=pexels-wolfgang-1002140-2747449.jpg&fm=jpg"
              alt=""
              className="w-full h-[700px] object-cover"
            />
          </div>
          <div className="absolute top-0 left-0 z-10 h-full flex flex-col justify-center bg-gradient-to-r md:w-3/4 lg:w-2/3 from-gray-950 to-transparent text-white p-20">
            <h1 className="text-5xl md:3/4 lg:w-4/5 font-bold mb-4">Seamless Event Booking – Plan, Book, and Enjoy!</h1>
            <p className="text-xl max-w-2xl my-6">Effortless event planning at your fingertips! Secure your spot with just a few clicks and make your occasions unforgettable.</p>
            <NavLink to='/login'>
              <button className="md:w-1/3 lg:w-1/4 bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold text-lg shadow-lg hover:bg-gray-100 hover:text-blue-600 transition">
                Get Started
              </button>
            </NavLink>
          </div>
        </div>

        {/* Search Input */}
        <div className="w-3/4 my-10 flex mx-auto border text-black border-black ">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            className="border-none rounded-tl-xl rounded-bl-xl p-2 w-3/4"
          />
          <input type="submit" value="Search" className="bg-blue-600 rounded-tr-xl rounded-br-xl w-1/4 text-white p-4" />
        </div>

        {/* Events Section */}
        <div className="mx-10 my-5 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5">
          {filteredEvents.length > 0 &&
            filteredEvents.map((event) => {
              const eventDate = new Date(event.eventDate);
              const currentDate = new Date();

              if (eventDate > currentDate || eventDate.toDateString() === currentDate.toDateString()) {
                return (
                  <div className="bg-slate-900 text-white rounded-xl relative shadow-lg" key={event._id}>
                    <div className='rounded-t-xl object-fill aspect-16:9'>
                      {event.image && (
                        <img
                          src={`${event.image}`}
                          alt={event.title}
                          width="300"
                          height="200"
                          className="w-full h-96 object-cover rounded-t-xl"
                        />
                      )}
                      <div className="absolute flex gap-4 bottom-[240px] right-8 md:bottom-[20px] md:right-3 lg:bottom-[250px] lg:right-4 sm:bottom-[260px] sm:right-3">
                        <button onClick={() => handleLike(event._id)} className="hover:scale-110 transition-transform">
                          <BiLike className="w-auto h-12 lg:h-10 sm:h-12 md:h-10 bg-orange-500 p-2 rounded-full shadow-md transition-all hover:bg-orange-600" />
                        </button>
                      </div>
                    </div>

                    <div className="m-4 grid gap-2">
                      <div className="flex justify-between items-center">
                        <h1 className="font-bold text-xl mt-2 text-orange-400">{event.title.toUpperCase()}</h1>
                        <div className="flex gap-2 items-center mr-4 text-orange-500"> <BiLike /> {event.likes}</div>
                      </div>

                      <div className="flex text-sm flex-nowrap justify-between text-slate-400 font-bold mr-4">
                        <div>{event.eventDate.split("T")[0]}, {event.eventTime}</div>
                        <div>{event.ticketPrice === 0 ? 'Free' : 'Rs. ' + event.ticketPrice}</div>
                      </div>

                      <div className="text-xs flex flex-col flex-wrap truncate-text text-slate-300">{event.description}</div>
                      <div className="flex justify-between items-center my-2 mr-4">
                        <div className="text-sm text-slate-400">Organized By: <br /><span className="font-bold text-orange-400">{event.owner.toUpperCase()}</span></div>
                      </div>
                      <Link to={'/event/' + event._id} className="flex justify-center">
                        <button className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-600 transition-all">Book Ticket <BsArrowRightShort className="w-6 h-6" /></button>
                      </Link>
                    </div>
                  </div>

                );
              }
              return null;
            })}
        </div>

        {/* Additional Information Section */}
        <WhyChooseUs />



        {/* Call to Action Section */}
        <div className="mx-10 my-10 p-8 rounded-lg bg-slate-900 text-center shadow-xl border border-gray-700">
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-wide">
            Ready to Book Your Next Event?
          </h2>
          <p className="text-gray-400 text-lg mb-6">
            Experience seamless and hassle-free event booking with just one click!
          </p>
          <NavLink to="/login">
            <button className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-8 py-3 rounded-2xl font-bold text-lg shadow-lg hover:scale-105 hover:shadow-orange-500/50 transition-all duration-300">
              Get Started 🚀
            </button>
          </NavLink>
        </div>

        <Features />

      </div>
    </>
  );
}