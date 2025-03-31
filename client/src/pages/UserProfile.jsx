import { useState, useEffect } from "react";
import axios from "axios";
import useUserStore from '../store';
import Chat from "../components/Chat";

function UserProfile() {
  const [organizers, setOrganizers] = useState([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        const response = await axios.get("/organizers"); // Fetch all organizers
        setOrganizers(response.data);
      } catch (error) {
        console.error("Error fetching organizers:", error);
        setError("Failed to load organizers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizers();
  }, []);

  const handleOrganizerChange = (e) => {
    const selectedEmail = e.target.value;
    const organizer = organizers.find((org) => org.email === selectedEmail);
    setSelectedOrganizer(organizer || null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-500 text-center mb-4">User  Profile</h1>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-2">{user?.name}</h2>
        <p className="text-gray-700">Email: {user?.email}</p>

        <h3 className="text-lg font-semibold mt-4">Select an Organizer to Chat</h3>
        {loading ? (
          <p className="text-gray-500">Loading organizers...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <select
            className="border p-2 w-full rounded mt-2"
            onChange={handleOrganizerChange}
            value={selectedOrganizer?.email || ""}
          >
            <option value="">-- Select Organizer --</option>
            {organizers.map((org) => (
              <option key={org.email} value={org.email}>
                {org.name}
              </option>
            ))}
          </select>
        )}

        {selectedOrganizer && (
          <div className="mt-6">
            <Chat
              userEmail={user.email}
              userName={user.name}
              organizerEmail={selectedOrganizer.email}
              organizerName={selectedOrganizer.name}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;