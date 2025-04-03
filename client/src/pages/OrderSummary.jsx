import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams } from 'react-router-dom';
import useUserStore from '../store';

export default function OrderSummary() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [quantity, setQuantity] = useState(1); // Default quantity 1
  const setTicketQuantity = useUserStore((state) => state.setTicketQuantity); // Get the setTicketQuantity function

  useEffect(() => {
    if (!id) return;
    axios
      .get(`/event/${id}/ordersummary`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, [id]);

  //! Handle checkbox change
  const handleCheckboxChange = (e) => {
    setIsCheckboxChecked(e.target.checked);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => {
      const newQuantity = prev + 1;
      setTicketQuantity(newQuantity); // Update Zustand store
      return newQuantity;
    });
  };
 
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => {
        const newQuantity = prev - 1;
        setTicketQuantity(newQuantity); // Update Zustand store
        return newQuantity;
      });
    }
  };
  
  if (!event) return "";

  return (
    <div className="bg-slate-900 min-h-screen text-white p-6">
    {/* Back Button */}
    <Link to={'/event/' + event._id}>
      <button
        className="
          inline-flex 
          mt-12
          gap-2
          p-3 
          ml-12
          bg-gray-800
          hover:bg-blue-700
          text-white
          justify-center 
          items-center 
          font-bold
          rounded-md
          transition duration-300"
      >
        <IoMdArrowBack className="w-6 h-6" />
        Back
      </button>
    </Link>
  
    <div className="flex flex-col">
      <div className="inline-flex gap-5 mt-8">
        {/* Terms & Conditions */}
        <div className="p-6 ml-12 bg-gray-800 text-white w-3/4 rounded-md shadow-lg">
          <h2 className="text-left font-bold text-orange-400">Terms & Conditions</h2>
          <br />
          <ul className="space-y-3 text-gray-300">
            <li>Refunds will be provided for ticket cancellations made up to 14 days before the event date.</li>
            <li>Tickets will be sent as e-tickets via email. Show it on your device or print it for entry.</li>
            <li>Each person can purchase a maximum of 2 tickets to ensure fair distribution.</li>
            <li>In case of cancellation or postponement, notifications will be sent via email.</li>
            <li>Tickets for postponed events remain valid for the new date and are non-refundable.</li>
            <li>Your privacy is important; by using our app, you agree to our privacy policy.</li>
            <li>Review and accept our terms before purchasing your tickets.</li>
          </ul>
        </div>
  
        {/* Booking Summary */}
        <div className="w-1/4 p-6 bg-blue-950 text-white rounded-md shadow-lg">
          <h2 className="mt-2 font-bold text-orange-400">Booking Summary</h2>
  
          {/* Event Details */}
          <div className="text-sm flex justify-between text-gray-300 mt-5">
            <div className="text-left">{event.title}</div>
            <div className="text-right pr-5">LKR. {event.ticketPrice}</div>
          </div>
  
          {/* Quantity Controls */}
          <div className="flex justify-between items-center mt-5">
            <button
              onClick={decreaseQuantity}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-lg font-bold rounded-md transition duration-300"
            >
              -
            </button>
            <span className="text-lg font-bold">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="px-3 py-1 bg-blue-700 hover:bg-orange-500 text-white text-lg font-bold rounded-md transition duration-300"
            >
              +
            </button>
          </div>
  
          {/* Sub Total */}
          <hr className="my-4 border-gray-600" />
          <div className="text-sm font-bold flex justify-between text-gray-300">
            <div className="text-left">SUB TOTAL</div>
            <div className="text-right pr-5">LKR. {quantity * event.ticketPrice}</div>
          </div>
  
          {/* Checkbox */}
          <div className="flex items-center mt-4 text-gray-300">
            <input className="h-5 w-5 accent-orange-500" type="checkbox" onChange={handleCheckboxChange} />
            <div className="px-2 text-xs">
              I have verified the Event name, date, and time before proceeding. I accept the terms and conditions.
            </div>
          </div>
  
          {/* Proceed Button */}
          <div className="mt-5">
            <Link to={`/event/${event._id}/ordersummary/paymentsummary`}>
              <button
                className={`p-3 w-full text-gray-100 font-bold rounded-md transition duration-300 ${
                  isCheckboxChecked ? "bg-blue-700 hover:bg-orange-500" : "bg-gray-500 cursor-not-allowed"
                }`}
                disabled={!isCheckboxChecked}
              >
                Proceed
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
  

  );
}