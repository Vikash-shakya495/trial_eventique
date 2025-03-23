import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { IoMdArrowBack } from 'react-icons/io';
import Qrcode from 'qrcode';
import useUserStore from '../store';

export default function PaymentSummary() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const user = useUserStore((state) => state.user);
  const ticketQuantity = useUserStore((state) => state.ticketQuantity);
  const [details, setDetails] = useState({
    name: '',
    email: '',
    contactNo: '',
  });

  const [ticketDetails, setTicketDetails] = useState({
    userid: user ? user._id : '',
    eventid: '',
    ticketDetails: {
      name: '',
      email: '',
      eventname: '',
      eventdate: '',
      eventtime: '',
      ticketprice: '',
      qr: '',
      totaltickets: ticketQuantity, // Set default quantity here
    }
  });

  const [payment, setPayment] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  const [redirect, setRedirect] = useState('');
  const [ticketId, setTicketId] = useState(''); // State to hold the generated ticketId

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/event/${id}/ordersummary/paymentsummary`).then(response => {
      setEvent(response.data);
      setTicketDetails(prevTicketDetails => ({
        ...prevTicketDetails,
        eventid: response.data._id,
        ticketDetails: {
          ...prevTicketDetails.ticketDetails,
          eventname: response.data.title,
          eventdate: response.data.eventDate.split("T")[0],
          eventtime: response.data.eventTime,
          ticketprice: response.data.ticketPrice,
        }
      }));
      // Generate ticketId when event data is fetched
      const generatedTicketId = generateTicketId(response.data.title);
      setTicketId(generatedTicketId);
    }).catch((error) => {
      console.error("Error fetching events:", error);
    });
  }, [id]);

  // Update ticketDetails when user details change
  useEffect(() => {
    setTicketDetails(prevTicketDetails => ({
      ...prevTicketDetails,
      userid: user ? user._id : '',
      ticketDetails: {
        ...prevTicketDetails.ticketDetails,
        name: details.name, // Use the name from details
        email: details.email, // Use the email from details
      }
    }));
  }, [details, user]);

  if (!event) return '';

  const handleChangeDetails = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleChangePayment = (e) => {
    const { name, value } = e.target;
    setPayment((prevPayment) => ({
      ...prevPayment,
      [name]: value,
    }));
  };

  const createTicket = async (e) => {
    e.preventDefault();
    try {
      const qrCode = await generateQRCode(
        ticketDetails.ticketDetails.eventname,
        ticketDetails.ticketDetails.name
      );
      // Ensure ticketId is generated and not empty
      if (!ticketId) {
        console.error("Ticket ID is not generated.");
        return; // Prevent ticket creation if ticketId is not valid
      }

      const updatedTicketDetails = {
        ...ticketDetails,
        ticketDetails: {
          ...ticketDetails.ticketDetails,
          qr: qrCode,
          totaltickets: ticketQuantity, // Ensure quantity is included
          ticketId: ticketId, // Include the ticketId here
        }
      };

      const response = await axios.post(`/tickets`, updatedTicketDetails);
      alert("Ticket Created");
      setRedirect(true);
      console.log('Success creating ticket', updatedTicketDetails);
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  async function generateQRCode(name, eventName) {
    try {
      const qrCodeData = await Qrcode.toDataURL(
        `Event Name: ${eventName} \n Name: ${name}`
      );
      return qrCodeData;
    } catch (error) {
      console.error("Error generating QR code:", error);
      return null;
    }
  }

  // Function to generate ticketId
  const generateTicketId = (eventName) => {
    const prefix = eventName.substring(0, 2).toUpperCase(); // First 2 letters of event name
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    return `${prefix}${randomNum}`; // Combine them
  };

  console.log("Generated Ticket ID:", ticketId);
  
  if (redirect) {
    return <Navigate to={'/wallet'} />;
  }

  return (
    <>
      <div>
        <Link to={'/event/' + event._id + '/ordersummary'}>
          <button className='inline-flex mt-12 gap-2 p-3 ml-12 bg-gray-100 justify-center items-center text-blue-700 font-bold rounded-sm'>
            <IoMdArrowBack className='font-bold w-6 h-6 gap-2' />
            Back
          </button>
        </Link>
      </div>
      <div className="ml-12 bg-gray-100 shadow-lg mt-8 p-16 w-3/5 float-left">
        {/* Your Details */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-bold mb-4">Your Details</h2>
          <input
            type="text"
            name="name"
            value={details.name}
            onChange={handleChangeDetails}
            placeholder="Name"
            className="input-field ml-10 w-80 h-10 bg-gray-50 border border-gray-30 rounded-md p-2.5"
          />
          <input
            type="email"
            name="email"
            value={details.email}
            onChange={handleChangeDetails}
            placeholder="Email"
            className="input-field w-80 ml-3 h-10 bg-gray-50 border border-gray-30 rounded-sm p-2.5"
          />
          <div className="flex space-x-4">
            <input
              type="tel"
              name="contactNo"
              value={details.contactNo}
              onChange={handleChangeDetails}
              placeholder="Contact No"
              className="input-field ml-10 w-80 h-10 bg-gray-50 border border-gray-30 rounded-sm p-2.5"
            />
          </div>
        </div>

        {/* Payment Option */}
        <div className="mt-10 space-y-4">
          <h2 className="text-xl font-bold mb-4">Payment Option</h2>
          <div className="ml-10">
            <button type="button" className="px-8 py-3 text-black bg-blue-100 focus:outline border rounded-sm border-gray-300" disabled>Credit / Debit Card</button>
          </div>

          <input
            type="text"
            name="nameOnCard"
            value="A.B.S.L. Perera"
            onChange={handleChangePayment}
            placeholder="Name on Card"
            className="input-field w-80 ml-10 h-10 bg-gray-50 border border-gray-30 rounded-sm p-2.5"
          />
          <input
            type="text"
            name="cardNumber"
            value="5648 3212 7802"
            onChange={handleChangePayment}
            placeholder="Card Number"
            className="input-field w-80 ml-3 h-10 bg-gray-50 border border-gray-30 rounded-sm p-2.5"
          />
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                name="expiryDate"
                value="12/25"
                onChange={handleChangePayment}
                placeholder="Expiry Date (MM/YY)"
                className="input-field w-60 ml-10 h-10 bg-gray-50 border border-gray-30 rounded-sm p-2.5"
              />
            </div>

            <input
              type="text"
              name="cvv"
              value="532"
              onChange={handleChangePayment}
              placeholder="CVV"
              className="input-field w-16 h-10 bg-gray-50 border border-gray-30 rounded-sm p-3"
            />
          </div>
          <div className="float-right">
            <p className="text-sm font-semibold pb-2 pt-8">Total : LKR. {event.ticketPrice}</p>
            <Link to={'/'}>
              <button type="button"
                onClick={createTicket}
                className="primary">
                Make Payment
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div className="float-right bg-blue-100 w-1/4 p-5 mt-8 mr-12">
        <h2 className="text-xl font-bold mb-8">Order Summary</h2>
        <div className="space-y-1">
          <div>
            <p className="float-right">Ticket</p>
          </div>
          <p className="text-lg font-semibold">{event.title}</p>
          <p className="text-xs">{event.eventDate.split("T")[0]},</p>
          <p className="text-xs pb-2"> {event.eventTime}</p>
          <hr className="my-2 border-t pt-2 border-gray-400" />
          <p className="float-right font-bold">LKR. {event.ticketPrice}</p>
          <p className="font-bold">Sub total: {event.ticketPrice}</p>
          <p className="font-bold">Ticket ID: {ticketId}</p> {/* Display the ticketId here */}
        </div>
      </div>
    </>
  );
}