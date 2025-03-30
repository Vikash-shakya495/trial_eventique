import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Chat from '../components/Chat';
import useUserStore from "../store"; // Assuming you have a user store to get the logged-in user's info

function UserProfile() {
  const [organizers, setOrganizers] = useState([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const user = useUserStore((state) => state.user); // Get the user object from the store

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await axios.get('/organizers'); // Adjust this endpoint to fetch all organizers
        setOrganizers(response.data);
      } catch (error) {
        console.error("Error fetching organizers:", error);
      }
    };

    fetchOrganizers();
  }, []);

  return (
    <div>
      <h1>User Profile</h1>
      <h2>Select an Organizer to Chat</h2>
      <ul>
        {organizers.map((organizer) => (
          <li key={organizer.email}>
            <button onClick={() => setSelectedOrganizer(organizer)}>
              {organizer.name} ({organizer.email})
            </button>
          </li>
        ))}
      </ul>

      {selectedOrganizer && (
        <Chat 
          userEmail={user.email} 
          userName={user.name} 
          organizerEmail={selectedOrganizer.email} 
          organizerName={selectedOrganizer.name} 
        />
      )}
    </div>
  );
}

export default UserProfile;