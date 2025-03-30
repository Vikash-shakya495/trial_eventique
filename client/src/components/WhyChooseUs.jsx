import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const FeatureItem = ({ text, image }) => (
  <motion.div
    className="flex flex-col items-center bg-white  rounded-lg p-4 mb-4 transition-transform transform hover:scale-105"
    whileHover={{ scale: 1.05 }}
  >
    <img src={image} alt={text} className="w-40 h-36 mr-3 rounded-full object-cover" />
    <div className="flex items-center">
      <FaCheckCircle className="text-green-500 mr-2" size={24} />
      <span className="text-gray-800">{text}</span>
    </div>
  </motion.div>
);

export default function WhyChooseUs() {
  const features = [
    {
      text: "Easy and intuitive interface for seamless navigation.",
      image: "https://brandemic.in/wp-content/uploads/2023/04/Interaction-Design-bro-1024x1024.webp", // Replace with actual image URLs
    },
    {
      text: "Wide range of events to choose from, including concerts, workshops, and conferences.",
      image: "https://fourwaves.com/media/kzqjw1wp/samuel-pereira-uf2nnanwa8q-unsplash.jpg?quality=100&rnd=132980483087000000", // Replace with actual image URLs
    },
    {
      text: "Secure payment options to ensure your transactions are safe.",
      image: "https://cdn.prod.website-files.com/64db80a5e88c6b1723ff7649/6614fd474935ee14a26a81e9_safe%20payment%20methods.jpg", // Replace with actual image URLs
    },
    {
      text: "Real-time updates and notifications about your bookings.",
      image: "https://img.freepik.com/premium-vector/mail-notification-illustration-concept_108061-1930.jpg", // Replace with actual image URLs
    },
    {
        text: "One-to-one interaction with the organizer for events.",
        image: "https://www.notta.ai/pictures/one-on-one-meeting-guide.png", // Replace with actual image URLs
      },
  ];

  return (
    <div className="mx-10 my-10 p-6  rounded-lg ">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Why Choose Our Event Booking System?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4">
        {features.map((feature, index) => (
          <FeatureItem key={index} text={feature.text} image={feature.image} />
        ))}
      </div>
    </div>
  );
}