import { Link } from "react-router-dom";
import { IoMdArrowBack } from 'react-icons/io'
import { RiDeleteBinLine } from 'react-icons/ri'
import { useEffect, useState } from "react";
import axios from "axios";
import useUserStore from "../store";

export default function TicketPage() {
  const user = useUserStore((state) => state.user);
  const [userTickets, setUserTickets] = useState([]);

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`/tickets/user/${user._id}`);
      setUserTickets(response.data);
    } catch (error) {
      console.error('Error fetching user tickets:', error);
    }
  }

  const deleteTicket = async (ticketId) => {
    try {
      await axios.delete(`/tickets/${ticketId}`);
      fetchTickets();
      alert('Ticket Deleted');
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  }

  return (
    <div className="flex flex-col flex-grow bg-slate-900 text-white min-h-screen">
      <div className="mb-5 flex justify-between items-center px-4 md:px-12 pt-8">
        <Link to='/'>
          <button className='inline-flex gap-2 p-2 md:p-3 bg-gray-800 hover:bg-gray-700 text-orange-500 font-bold rounded-md'>
            <IoMdArrowBack className='w-5 h-5 md:w-6 md:h-6' />
            Back
          </button>
        </Link>
        <div className="hidden">
          <RiDeleteBinLine className="h-6 w-10 text-red-500" />
        </div>
      </div>

      <div className="px-4 md:px-12 grid grid-cols-1 xl:grid-cols-2 gap-5 pb-10">
        {userTickets.map(ticket => (
          <div key={ticket._id} className="relative bg-gray-800 rounded-lg shadow-lg p-4 md:p-5">
            <button onClick={() => deleteTicket(ticket._id)} className="absolute top-2 right-2">
              <RiDeleteBinLine className="h-6 w-6 text-red-500" />
            </button>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0 w-full md:w-40 h-auto">
                <img
                  src={ticket.ticketDetails.qr}
                  alt="QRCode"
                  className="w-full h-full object-contain rounded-md"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm md:text-base">
                <div>
                  Event Name: <br />
                  <span className="font-extrabold text-orange-400">
                    {ticket.ticketDetails.eventname.toUpperCase()}
                  </span>
                </div>
                <div>
                  Date & Time:<br />
                  <span className="font-extrabold text-orange-400">
                    {ticket.ticketDetails.eventdate.split("T")[0]}, {ticket.ticketDetails.eventtime}
                  </span>
                </div>
                <div>
                  Name: <br />
                  <span className="font-extrabold text-blue-400">
                    {ticket.ticketDetails.name.toUpperCase()}
                  </span>
                </div>
                <div>
                  Price: <br />
                  <span className="font-extrabold text-blue-400">
                    Rs. {ticket.ticketDetails.ticketprice}
                  </span>
                </div>
                <div>
                  Email: <br />
                  <span className="font-extrabold text-blue-400 line-clamp-2">
                    {ticket.ticketDetails.email}
                  </span>
                </div>
                <div>
                  Ticket ID:<br />
                  <span className="font-extrabold text-blue-400">
                    {ticket.ticketDetails.ticketId}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
