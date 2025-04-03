import axios from "axios";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaCheckCircle, FaClock, FaTimesCircle, FaTicketAlt, FaMoneyBillWave } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("/events/dashboard-stats")
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Failed to fetch stats:", err));

    axios.get("/events")
      .then((res) => {
        const eventData = res.data?.events || res.data;
        if (Array.isArray(eventData)) {
          setEvents(eventData);
        } else {
          console.error("Unexpected response format:", res.data);
          setEvents([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch events:", err);
        setEvents([]);
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

  const getRandomColor = () => {
    const colors = [
      "#f0f4f8", // Light Gray
      "#e0f7fa", // Light Cyan
      "#e1bee7", // Light Purple
      "#ffe0b2", // Light Orange
      "#ffccbc", // Light Red
      "#c8e6c9", // Light Green
      "#bbdefb", // Light Blue
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  if (!stats) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <h1 className="text-3xl font-bold text-orange-500 mb-6 font-serif text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        {[
          { label: "Total Events", value: stats.totalEvents, icon: <FaCalendarAlt className="text-2xl text-white" /> },
          { label: "Approved Events", value: stats.approvedEvents, icon: <FaCheckCircle className="text-2xl text-green-400" /> },
          { label: "Pending Events", value: stats.pendingEvents, icon: <FaClock className="text-2xl text-yellow-400" /> },
          { label: "Cancelled Events", value: stats.cancelledEvents, icon: <FaTimesCircle className="text-2xl text-red-500" /> },
          { label: "Tickets Sold", value: stats.totalTicketsSold, icon: <FaTicketAlt className="text-2xl text-blue-400" /> },
          { label: "Total Refunds", value: `$${stats.totalRefunds}`, icon: <FaMoneyBillWave className="text-2xl text-green-300" /> },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-4 text-white bg-gray-800 shadow-lg rounded-md text-center transition-transform transform hover:scale-105 hover:shadow-2xl"
          >
            <h2 className="text-lg font-semibold flex items-center justify-center">
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </h2>
            <p className="text-2xl font-bold text-orange-400">{item.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold my-4 text-orange-400">Manage Events</h2>
      <div className="bg-gray-800 p-6 shadow-lg rounded-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-blue-900 text-white">
              <th className="p-4 text-lg">Title</th>
              <th className="p-4 text-lg">Event Date</th>
              <th className="p-4 text-lg">Location</th>
              <th className="p-4 text-lg">Organized By</th>
              <th className="p-4 text-lg">Status</th>
              <th className="p-4 text-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="border-b text-center hover:bg-gray-700 transition-colors duration-200">
                <td className="p-4 text-white border-b border-gray-600">{event.title}</td>
                <td className="p-4 text-gray-300 border-b border-gray-600">{event.eventDate}</td>
                <td className="p-4 text-gray-300 border-b border-gray-600">{event.location}</td>
                <td className="p-4 text-gray-300 border-b border-gray-600">{event.owner}</td>
                <td className={`p-4 font-bold rounded-md ${event.status === "approved" ? "bg-green-500 text-white" : event.status === "cancelled" ? "bg-red-500 text-white" : "bg-yellow-500 text-gray-900"}`}>
                  {event.status}
                </td>
                <td className="p-4">
                  {event.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateEventStatus(event._id, "approved")}
                        className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 transition duration-300 hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateEventStatus(event._id, "cancelled")}
                        className="bg-red-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-red-600"
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