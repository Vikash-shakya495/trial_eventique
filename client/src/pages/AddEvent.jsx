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
    organizedBy: "",
    eventDate: "",
    eventTime: "",
    location: "",
    ticketPrice: 0,
    image: null,
    likes: 0
  });

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

    try {
      const response = await axios.post("/createEvent", formDataToSend,{
        headers: {
          "Content-Type": "multipart/form-data",
          },
      });
      console.log("Event posted successfully:", response.data);
    } catch (error) {
      console.error("Error posting event:", error.response?.data || error.message);
    }
  };

  return (
    <div className='flex flex-col ml-20 mt-10'>
      <h1 className='font-bold text-[36px] mb-5'>Post an Event</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
        <label>
          Title:
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </label>
        <label>
          Optional:
          <input type="text" name="optional" value={formData.optional} onChange={handleChange} />
        </label>
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>
        <label>
          Organized By:
          <input type="text" name="organizedBy" value={formData.organizedBy} onChange={handleChange} required />
        </label>
        <label>
          Event Date:
          <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} required />
        </label>
        <label>
          Event Time:
          <input type="time" name="eventTime" value={formData.eventTime} onChange={handleChange} required />
        </label>
        <label>
          Location:
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </label>
        <label>
          Ticket Price:
          <input type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} required />
        </label>
        <label>
          Image:
          <input type="file" name="image" onChange={handleImageUpload} accept="image/*" required />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
