import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import { AiFillCalendar } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { FaCopy, FaWhatsappSquare, FaFacebook } from "react-icons/fa";

export default function EventPage() {
  const {id} = useParams();
  const [event, setEvent] = useState(null);

  //! Fetching the event data from server by ID ------------------------------------------
  useEffect(()=>{
    if(!id){
      return;
    }
    axios.get(`/event/${id}`).then(response => {
      setEvent(response.data)
      console.log(response.data)
    }).catch((error) => {
      console.error("Error fetching events:", error);
    });
  }, [id])

  //! Copy Functionalities -----------------------------------------------
  const handleCopyLink = () => {
    const linkToShare = window.location.href;
    navigator.clipboard.writeText(linkToShare).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  const handleWhatsAppShare = () => {
    const linkToShare = window.location.href;
    const whatsappMessage = encodeURIComponent(`${linkToShare}`);
    window.open(`whatsapp://send?text=${whatsappMessage}`);
  };

  const handleFacebookShare = () => {
    const linkToShare = window.location.href;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkToShare)}`;
    window.open(facebookShareUrl);
  };
  
if (!event) return '';
  return (
    <div className="flex flex-col mx-5 xl:mx-32 md:mx-10 mt-5 flex-grow bg-slate-900 text-white p-6 rounded-lg shadow-lg">
  {/* Event Image */}
  <div>
    {event.image && (
      <img
        src={`${event.image}`}
        alt=""
        className="rounded object-cover mx-auto w-2/4 border border-gray-700 shadow-md"
      />
    )}
  </div>

  {/* Event Title & Booking */}
  <div className="flex justify-between mt-8 mx-2">
    <h1 className="text-3xl md:text-5xl font-extrabold text-orange-500">
      {event.title.toUpperCase()}
    </h1>
    <Link to={"/event/" + event._id + "/ordersummary"}>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition-transform transform hover:scale-105">
        Book Ticket
      </button>
    </Link>
  </div>

  {/* Ticket Price */}
  <div className="mx-2">
    <h2 className="text-md md:text-xl font-bold mt-3 text-orange-400">
      {event.ticketPrice === 0 ? "Free" : "LKR. " + event.ticketPrice}
    </h2>
  </div>

  {/* Event Description */}
  <div className="mx-2 mt-5 text-md md:text-lg text-gray-300 truncate-3-lines">
    {event.description}
  </div>

  {/* Organizer */}
  <div className="mx-2 mt-5 text-md md:text-xl font-bold text-blue-400">
    Organized By {event.owner}
  </div>

  {/* Date, Time & Location */}
  <div className="mx-2 mt-5">
    <h1 className="text-md md:text-xl font-extrabold text-white">
      When and Where
    </h1>
    <div className="sm:mx-5 lg:mx-32 mt-6 flex flex-row items-center justify-between gap-4">
      {/* Date & Time */}
      <div className="flex items-center gap-4">
        <AiFillCalendar className="w-auto h-5 text-gray-300" />
        <div className="flex flex-col gap-1">
          <h1 className="text-md md:text-lg font-extrabold text-orange-400">
            Date and Time
          </h1>
          <div className="text-sm md:text-lg text-gray-300">
            Date: {event.eventDate.split("T")[0]} <br />
            Time: {event.eventTime}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center gap-4">
        <MdLocationPin className="w-auto h-5 text-gray-300" />
        <div className="flex flex-col gap-1">
          <h1 className="text-md md:text-lg font-extrabold text-orange-400">
            Location
          </h1>
          <div className="text-sm md:text-lg text-gray-300">{event.location}</div>
        </div>
      </div>
    </div>
  </div>

  {/* Share Buttons */}
  <div className="mx-2 mt-5 text-md md:text-xl font-extrabold text-white">
    Share with Friends
    <div className="mt-10 flex gap-5 mx-10 md:mx-32">
      <button
        onClick={handleCopyLink}
        className="text-gray-400 hover:text-orange-500 transition duration-300"
      >
        <FaCopy className="w-auto h-6" />
      </button>

      <button
        onClick={handleWhatsAppShare}
        className="text-green-500 hover:text-green-400 transition duration-300"
      >
        <FaWhatsappSquare className="w-auto h-6" />
      </button>

      <button
        onClick={handleFacebookShare}
        className="text-blue-500 hover:text-blue-400 transition duration-300"
      >
        <FaFacebook className="w-auto h-6" />
      </button>
    </div>
  </div>
</div>

  )
}
