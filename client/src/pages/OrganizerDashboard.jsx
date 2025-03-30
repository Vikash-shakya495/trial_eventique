import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useUserStore from "../store";
import AddEvent from './AddEvent';
import Chat from '../components/Chat'

const OrganizerDashboard = () => {
   const [organizer, setOrganizer] = useState(null);
   const [events, setEvents] = useState([]);
   const [totalIncome, setTotalIncome] = useState(0);
   const user = useUserStore((state) => state.user); // Get the user object from the store
   const organizerEmail = user ? user.email : null; // Safely access the email


   useEffect(() => {
      if (!organizerEmail) {
         console.error("Organizer email is not available.");
         return; // Exit if the email is not available
      }

      const fetchOrganizer = async () => {
         try {
            const response = await axios.get(`/organizers/${organizerEmail}`);
            setOrganizer(response.data);
         } catch (error) {
            console.error("Error fetching organizer:", error);
         }
      };

      // console.log(organizer)
      const fetchEvents = async () => {
         try {
            const response = await axios.get(`/organizer/events/${organizerEmail}`);
            console.log("Fetched events:", response.data); // Log the response data

            // Check if response.data is an array
            if (Array.isArray(response.data)) {
               setEvents(response.data); // Set events if it's an array
            } else {
               console.error("Unexpected response format:", response.data);
               setEvents([]); // Set to empty array if the format is unexpected
            }
         } catch (error) {
            console.error("Error fetching events:", error);
         }
      };

      fetchOrganizer();
      fetchEvents();




   }, [organizerEmail]);


   // Yeh alag useEffect me rakhein
   useEffect(() => {
      setTotalIncome(events.reduce((acc, event) => acc + (event.ticketPrice * event.ticketSold), 0));
   }, [events]);


   return (
      <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
         <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl">
            <h1 className="text-3xl font-bold text-blue-500 mb-4 text-center">Organizer Dashboard</h1>
            {organizer ? (
               <div className="bg-gray-50 p-4 rounded-lg shadow">
                  <h2 className="text-xl font-semibold text-gray-800">{organizer.name}</h2>
                  <p className="text-gray-600">Email: {organizer.email}</p>
                  <p className="text-gray-600">Events Organized: {organizer.eventsOrganised}</p>
                  <p className="text-gray-600">Total Refunds: {organizer.totalRefunds}</p>
                  <p className="text-gray-600">Total Income: ${totalIncome}</p>
               </div>
            ) : (
               <p className="text-red-500">No organizer found.</p>
            )}

            <h2 className="text-2xl font-semibold text-gray-700 mt-6 mb-3">Your Events</h2>
            <div className="overflow-x-auto">
               <table className="w-full border-collapse border border-gray-300 shadow-sm rounded-lg">
                  <thead className="bg-blue-500 text-white">
                     <tr>
                        <th className="p-3 border">Title</th>
                        <th className="p-3 border">Date</th>
                        <th className="p-3 border">Time</th>
                        <th className="p-3 border">Location</th>
                        <th className="p-3 border">Status</th>
                        <th className="p-3 border">Participants</th>
                        <th className="p-3 border">Income</th>
                        <th className="p-3 border">Refunds</th>
                     </tr>
                  </thead>
                  <tbody>
                     {Array.isArray(events) && events.length > 0 ? (
                        events.map((event) => (
                           <tr key={event._id} className="text-gray-700 bg-gray-50 even:bg-gray-100">
                              <td className="p-3 border">{event.title}</td>
                              <td className="p-3 border">{new Date(event.eventDate).toLocaleDateString()}</td>
                              <td className="p-3 border">{event.eventTime}</td>
                              <td className="p-3 border">{event.location}</td>
                              <td className="p-3 border">{event.status}</td>
                              <td className="p-3 border">{event.ticketSold}</td>
                              <td className="p-3 border">${event.Income}</td>
                              <td className="p-3 border">${event.refunds}</td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan="8" className="p-3 border text-center text-gray-500">No Events found</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>

            <div className="mt-6 flex justify-center gap-4">
               <AddEvent />
               <Chat userEmail={user?.email} organizerEmail={organizerEmail} />

            </div>
         </div>
      </div>);
};

export default OrganizerDashboard;