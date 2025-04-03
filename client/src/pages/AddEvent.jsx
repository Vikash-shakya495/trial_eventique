import { useState } from 'react';
import axios from 'axios';
import useUserStore from "../store";

export default function AddEvent() {
  const user = useUserStore((state) => state.user);
  const [formData, setFormData] = useState({
    owner: user ? user.name : "",
    title: "",
    email: user ? user.email : "",
    optional: "",
    description: "",
    organizedBy: user ? user._id : "",
    eventDate: "",
    eventTime: "",
    location: "",
    ticketPrice: 0,
    image: null,
    likes: 0
  });
  
  const [loading, setLoading] = useState(false); // State for loading
  const [successMessage, setSuccessMessage] = useState(""); // State for success message

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prevState) => ({ ...prevState, image: file }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    // Append fields to FormData
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    setLoading(true); // Set loading to true
    setSuccessMessage(""); // Reset success message

    try {
      const response = await axios.post("/createEvent", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Event posted successfully:", response.data);
      setSuccessMessage("Event created successfully!"); // Set success message
    } catch (error) {
      console.error("Error posting event:", error.response?.data || error.message);
      setSuccessMessage("Error creating event. Please try again."); // Set error message
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return (
    <div className="mx-auto bg-slate-900 p-6 rounded-xl mt-10 border-2 border-gray-700 w-full shadow-lg">
  <h1 className="text-3xl font-bold text-orange-500 mb-5 text-center">Post an Event</h1>
  <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
    <div className='flex gap-4'>
      <div className='w-1/2'>
        <label className="font-semibold text-white">
          Title:
          <input type="text" name="title" value={formData.title} onChange={handleChange} required className="block w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white" />
        </label>
        <label className="font-semibold text-white">
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required className="block w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white" />
        </label>
        <label className="font-semibold text-white">
          Organized By:
          <input type="text" name="organizedBy" value={formData.owner} onChange={handleChange} required className="block w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white" />
        </label>
        <label className="font-semibold text-white">
          Event Date:
          <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required className="block w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white" />
        </label>
      </div>
      <div className='w-1/2'>
        <label className="font-semibold text-white">
          Event Time:
          <input type="time" name="eventTime" value={formData.eventTime} onChange={handleChange} required className="block w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white" />
        </label>
        <label className="font-semibold text-white">
          Location:
          <input type="text" name="location" value={formData.location} onChange={handleChange} required className="block w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white" />
        </label>
        <label className="font-semibold text-white">
          Ticket Price:
          <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} required className="block w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white" />
        </label>
        <label className="font-semibold text-white">
          Image:
          <input type="file" name="image" onChange={handleImageUpload} accept="image/*" required className="block w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-white" />
        </label>
      </div>
    </div>
    <button type="submit" className="bg-blue-600 hover:bg-orange-500 text-white font-semibold py-2 rounded-md transition text-lg">
      {loading ? "Posting..." : "Submit"}
    </button>
    {loading && (
      <div className="flex justify-center mt-4">
        <img src='https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-07-846_512.gif' alt="Loading..." className="w-16 h-16" />
      </div>
    )}
    {successMessage && <p className="text-green-400 text-center font-semibold">{successMessage}</p>}
  </form>
</div>

  );
}