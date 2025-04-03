import axios from "axios";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths } from "date-fns";
import { useEffect, useState } from "react";
import { BsCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);

  // Fetch approved events from the server
  useEffect(() => {
    axios.get("/events")
      .then((response) => {
        const approvedEvents = response.data.events.filter(event => event.status === "approved");
        setEvents(approvedEvents);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });
  const firstDayOfWeek = firstDayOfMonth.getDay();

  // Create an array of empty cells to align days correctly
  const emptyCells = Array.from({ length: firstDayOfWeek }, (_, index) => (
    <div key={`empty-${index}`} className="p-2"></div>
  ));

  return (
    <div className="p-4 md:mx-16 bg-slate-900 rounded-lg shadow-lg">
      <div className="rounded p-2 bg-gray-800 shadow-md">
        {/* Month Navigation */}
        <div className="flex items-center mb-4 justify-center gap-6 ">
          <button
            className="text-orange-500 hover:text-orange-400 transition duration-300"
            onClick={() => setCurrentMonth((prevMonth) => addMonths(prevMonth, -1))}
          >
            <BsCaretLeftFill className="w-auto h-5" />
          </button>
          <span className="text-xl font-semibold text-white">{format(currentMonth, "MMMM yyyy")}</span>
          <button
            className="text-orange-500 hover:text-orange-400 transition duration-300"
            onClick={() => setCurrentMonth((prevMonth) => addMonths(prevMonth, 1))}
          >
            <BsFillCaretRightFill className="w-auto h-5" />
          </button>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 text-center bg-gray-700 rounded-t-lg">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 font-semibold text-orange-400">{day}</div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 bg-gray-900 rounded-b-lg">
          {emptyCells.concat(
            daysInMonth.map((date) => (
              <div key={date.toISOString()} className="p-2 relative pb-20 sm:pb-24 flex flex-col items-start justify-start border border-gray-700">
                <div className="font-bold text-gray-300">{format(date, "dd")}</div>
                <div className="absolute top-8">
                  {events
                    .filter((event) =>
                      format(new Date(event.eventDate), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                    )
                    .map((event) => (
                      <div key={event._id} className="mt-0 flex md:mt-2">
                        <Link to={`/event/${event._id}`}>
                          <div className="text-white bg-gradient-to-r from-blue-600 to-orange-500 rounded p-1 font-bold text-xs md:text-base md:p-2 transition-transform transform hover:scale-105 hover:from-blue-700 hover:to-orange-600">
                            {event.title.toUpperCase()}
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>

  );
}