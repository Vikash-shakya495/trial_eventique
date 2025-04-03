import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useUserStore from "../store";
import AddEvent from './AddEvent';
import Chat from '../components/Chat';

const OrganizerDashboard = () => {
    const [organizer, setOrganizer] = useState(null);
    const [events, setEvents] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const user = useUserStore((state) => state.user);
    const organizerEmail = user?.email;

    useEffect(() => {
        if (!organizerEmail) {
            console.error("Organizer email is not available.");
            return;
        }

        const fetchOrganizer = async () => {
            try {
                const response = await axios.get(`/organizers/${organizerEmail}`);
                setOrganizer(response.data);
            } catch (error) {
                console.error("Error fetching organizer:", error);
            }
        };

        const fetchEvents = async () => {
            try {
                const response = await axios.get(`/organizer/events/${organizerEmail}`);
                if (Array.isArray(response.data)) {
                    setEvents(response.data);
                } else {
                    console.error("Unexpected response format:", response.data);
                    setEvents([]);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchOrganizer();
        fetchEvents();
    }, [organizerEmail]);

    useEffect(() => {
        setTotalIncome(events.reduce((acc, event) => acc + (event.ticketPrice * event.ticketSold), 0));
    }, [events]);

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-6xl mx-auto bg-gray-800 p-6 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-orange-500 mb-4 text-center">Organizer Dashboard</h1>

                {organizer ? (
                    <div className="bg-gray-900 p-4 rounded-lg shadow">
                        <h2 className="text-xl font-semibold text-blue-400">{organizer.name}</h2>
                        <p className="text-gray-300">Email: {organizer.email}</p>
                        <p className="text-gray-300">Events Organized: {organizer.eventsOrganised}</p>
                        <p className="text-gray-300">Total Refunds: {organizer.totalRefunds}</p>
                        <p className="text-gray-300">Total Income: <span className="text-orange-400">${totalIncome}</span></p>
                    </div>
                ) : (
                    <p className="text-red-500">No organizer found.</p>
                )}

                <h2 className="text-2xl font-semibold text-orange-400 mt-6 mb-3">Your Events</h2>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-700 shadow-sm rounded-lg">
                        <thead className="bg-blue-700 text-white">
                            <tr>
                                <th className="p-3 border border-gray-600">Title</th>
                                <th className="p-3 border border-gray-600">Date</th>
                                <th className="p-3 border border-gray-600">Time</th>
                                <th className="p-3 border border-gray-600">Location</th>
                                <th className="p-3 border border-gray-600">Status</th>
                                <th className="p-3 border border-gray-600">Participants</th>
                                <th className="p-3 border border-gray-600">Income</th>
                                <th className="p-3 border border-gray-600">Refunds</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(events) && events.length > 0 ? (
                                events.map((event) => (
                                    <tr key={event._id} className="text-gray-300 bg-gray-800 even:bg-gray-900">
                                        <td className="p-3 border border-gray-600">{event.title}</td>
                                        <td className="p-3 border border-gray-600">{new Date(event.eventDate).toLocaleDateString()}</td>
                                        <td className="p-3 border border-gray-600">{event.eventTime}</td>
                                        <td className="p-3 border border-gray-600">{event.location}</td>
                                        <td className="p-3 border border-gray-600">{event.status}</td>
                                        <td className="p-3 border border-gray-600">{event.ticketSold}</td>
                                        <td className="p-3 border border-gray-600 text-orange-400">${event.income}</td>
                                        <td className="p-3 border border-gray-600 text-red-400">${event.refunds}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="p-3 border border-gray-600 text-center text-gray-400">No Events found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6 flex justify-center gap-4">
                    <AddEvent />
                    <Chat userEmail={user.email} userName={user.name} organizerEmail={organizerEmail} organizerName={organizer?.name} />
                </div>
            </div>
        </div>

    );
};

export default OrganizerDashboard;