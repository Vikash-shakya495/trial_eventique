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
      <div className="w-3/4 my-10 flex mx-auto border border-black rounded-xl">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="border-none rounded-xl p-2 w-3/4"
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
                <div className="bg-white rounded-xl relative" key={event._id}>
                  <div className='rounded-tl-[0.75rem] rounded-tr-[0.75rem] rounded-br-[0] rounded-bl-[0] object-fill aspect-16:9'>
                    {event.image && (
                      <img
                        src={`${event.image}`}
                        alt={event.title}
                        width="300"
                        height="200"
                        className="w-full h-96 object-cover"
                      />
                    )}
                    <div className="absolute flex gap-4 bottom-[240px] right-8 md:bottom-[20px] md:right-3 lg:bottom-[250px] lg:right-4 sm:bottom-[260px] sm:right-3">
                      <button onClick={() => handleLike(event._id)}>
                        <BiLike className="w-auto h-12 lg:h-10 sm:h-12 md:h-10 bg-white p-2 rounded-full shadow-md transition-all hover:text-primary" />
                      </button>
                    </div>
                  </div>

                  <div className="m-2 grid gap-2">
                    <div className="flex justify-between items-center">
                      <h1 className="font-bold text-lg mt-2">{event.title.toUpperCase()}</h1>
                      <div className="flex gap-2 items-center mr-4 text-red-600"> <BiLike /> {event.likes}</div>
                    </div>

                    <div className="flex text-sm flex-nowrap justify-between text-primarydark font-bold mr-4">
                      <div>{event.eventDate.split("T")[0]}, {event.eventTime}</div>
                      <div>{event.ticketPrice === 0 ? 'Free' : 'Rs. ' + event.ticketPrice}</div>
                    </div>

                    <div className="text-xs flex flex-col flex-wrap truncate-text">{event.description}</div>
                    <div className="flex justify-between items-center my-2 mr-4">
                      <div className="text-sm text-primarydark ">Organized By: <br /><span className="font-bold">{event.owner.toUpperCase()}</span></div>
                      {/* <div className="text-sm text-primarydark ">Created By: <br /> <span className="font-semibold">{event}</span></div> */}
                    </div>
                    <Link to={'/event/' + event._id} className="flex justify-center">
                      <button className="primary flex items-center gap-2">Book Ticket <BsArrowRightShort className="w-6 h-6" /></button>
                    </Link>
                  </div>
                </div>
              );
            }
            return null;
          })}
      </div>

      {/* Additional Information Section */}
      <WhyChooseUs/>



      {/* Call to Action Section */}
      <div className="mx-10 my-10 p-6 bg-white rounded-lg text-gray-900 text-center ">
      <h2 className="text-3xl font-bold mb-4">Ready to Book Your Next Event?</h2>
      <NavLink to='/login'>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold text-lg shadow-lg hover:bg-blue-700 transition">
          Get Started
        </button>
      </NavLink>
    </div>

      <Features />
      
    </div>
    </>
  );
}