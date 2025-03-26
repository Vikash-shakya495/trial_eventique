import axios from "axios";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("/events/dashboard-stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to fetch stats:", err));
  
      axios.get("/events")
      .then((res) => {
        console.log("Fetched events:", res.data.events); // Debugging
        
        // Check if response contains data key
        const eventData = res.data?.events || res.data;
        console.log("events data",eventData)
    
        if (Array.isArray(eventData)) {
          setEvents(eventData);
        } else {
          console.error("Unexpected response format:", res.data);
          setEvents([]); // Ensure events is always an array
        }
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
        setEvents([]); // Fallback to empty array
      });
    
  }, []);
  

  const updateEventStatus = async (id, status) => {
    try {
      await axios.patch(`/events/${id}/status`, { status });
      setEvents((prevEvents) => 
        prevEvents.map((event) => 
          event._id === id ? { ...event, status } : event
        )
      );
    } catch (error) {
      console.error("Failed to update event status:", error);
    }
  };
  

  if (!stats) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-700">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        {[
          { label: "Total Events", value: stats.totalEvents },
          { label: "Approved Events", value: stats.approvedEvents },
          { label: "Pending Events", value: stats.pendingEvents },
          { label: "Cancelled Events", value: stats.cancelledEvents },
          { label: "Tickets Sold", value: stats.totalTicketsSold },
          { label: "Total Refunds", value: `$${stats.totalRefunds}` },
        ].map((item, idx) => (
          <div key={idx} className="p-4 bg-white shadow-md rounded-md text-center">
            <h2 className="text-lg font-semibold">{item.label}</h2>
            <p className="text-2xl text-blue-500">{item.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold my-4">Manage Events</h2>
      <div className="bg-white p-4 shadow-md rounded-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Title</th>
              <th className="p-2">Event Date</th>
              <th className="p-2">Location</th>
              <th className="p-2">Organised By.</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="border-b text-center">
                <td className="p-2">{event.title}</td>
                <td className="p-2">{event.eventDate}</td>
                <td className="p-2">{event.location}</td>
                <td className="p-2">{event.organizedBy}</td>
                <td className={`p-2 ${event.status === "approved" ? "text-green-500" : event.status === "cancelled" ? "text-red-500" : "text-yellow-500"}`}>
                  {event.status}
                </td>
                <td className="p-2">
                  {event.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateEventStatus(event._id, "approved")}
                        className="bg-green-500 text-white px-3 py-1 rounded-md mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateEventStatus(event._id, "cancelled")}
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
