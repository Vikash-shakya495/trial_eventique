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

  if (!stats) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 bg-e0e1dd min-h-screen">
      <h1 className="text-3xl font-bold text-415a77 mb-6 font-serif">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        {[
          { label: "Total Events", value: stats.totalEvents, icon: <FaCalendarAlt className="text-2xl" /> },
          { label: "Approved Events", value: stats.approvedEvents, icon: <FaCheckCircle className="text-2xl" /> },
          { label: "Pending Events", value: stats.pendingEvents, icon: <FaClock className="text-2xl" /> },
          { label: "Cancelled Events", value: stats.cancelledEvents, icon: <FaTimesCircle className="text-2xl" /> },
          { label: "Tickets Sold", value: stats.totalTicketsSold, icon: <FaTicketAlt className="text-2xl" /> },
          { label: "Total Refunds", value: `$${stats.totalRefunds}`, icon: <FaMoneyBillWave className="text-2xl" /> },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-4 bg-gradient-to-r from-blue-800 to-[#0d1b2a] text-[#e0e1dd] shadow-lg rounded-md text-center transition-transform transform hover:scale-105 hover:shadow-2xl"
          >
            <h2 className="text-lg font-semibold flex items-center justify-center">
              {item.icon}
              <span className="ml-2">{item.label}</span>
            </h2>
            <p className="text-2xl">{item.value}</p>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-semibold my-4 text-415a77">Manage Events</h2>
      <div className="bg-white p-6 shadow-lg rounded-md overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-0d1b2a">
              <th className="p-4 text-2xl">Title</th>
              <th className="p-4 text-2xl">Event Date</th>
              <th className="p-4 text-2xl">Location</th>
              <th className="p-4 text-2xl">Organised By</th>
              <th className="p-4 text-2xl">Status</th>
              <th className="p-4 text-2xl">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="border-b text-center hover:bg-415a77 transition-colors duration-200">
                <td className="p-4 bg-blue-100 border-b rounded-2xl border-blue-500">{event.title}</td> {/* Title Column */}
                <td className="p-4 bg-green-100 border-b rounded-2xl border-green-500">{event.eventDate}</td> {/* Event Date Column */}
                <td className="p-4 bg-yellow-100 border-b rounded-2xl border-yellow-500">{event.location}</td> {/* Location Column */}
                <td className="p-4 bg-purple-100 border-b rounded-2xl border-purple-500">{event.organizedBy}</td> {/* Organised By Column */}
                <td className={`p-4 ${event.status === "approved" ? "bg-green-200 text-green-500" : event.status === "cancelled" ? "bg-red-200 text-red-500" : "bg-yellow-200 text-yellow-500"}`}>
                  {event.status}
                </td> {/* Status Column */}
                <td className="p-4 bg-gray-100"> {/* Actions Column */}
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