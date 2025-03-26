import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useUserStore from "../store";
import AddEvent from './AddEvent';
import Chat from './Chat'; 

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

   return (
      <div>
         <h1>Organizer Dashboard</h1>
         {organizer ? (
            <div>
               <h2>{organizer.name}</h2>
               <p>Email: {organizer.email}</p>
               <p>Events Organized: {organizer.eventsOrganised}</p>
               <p>Total Refunds: {organizer.totalRefunds}</p>
               <p>Total Income: ${organizer.income}</p>
            </div>
         ) : (
            <p>No organizer found.. </p>
         )}
         <h2>Your Events</h2>
         <table>
            <thead>
               <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Participants</th>
                  <th>Income</th>
                  <th>Refunds</th>
               </tr>
            </thead>
            <tbody>
               {Array.isArray(events) && events.length > 0 ? (
                  events.map((event) => (
                     <tr key={event._id}>
                        <td>{event.title}</td>
                        <td>{new Date(event.eventDate).toLocaleDateString()}</td>
                        <td>{event.eventTime}</td>
                        <td>{event.location}</td>
                        <td>{event.status}</td>
                        <td>{event.Participants}</td>
                        <td>{event.Income}</td>
                        <td>{event.refunds}</td>
                     </tr>
                  ))
               ) : (
                  <tr>
                     <td colSpan="8">No Events found </td>
                  </tr>
               )}
            </tbody>
         </table>
         {/* Add a form or button to create new events */}
         <AddEvent />
         <Chat userEmail={organizerEmail} organizerEmail={organizerEmail} />
      </div>
   );
};

export default OrganizerDashboard;