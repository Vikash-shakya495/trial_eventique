import { FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const FeatureItem = ({ text, image }) => (
  <motion.div
    className="flex flex-col items-center bg-gradient-to-br from-gray-100 to-white rounded-xl p-5 mb-6 shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
    whileHover={{ scale: 1.05 }}
  >
    <img
      src={image}
      alt={text}
      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
    />
    <div className="flex items-center mt-3">
      <FaCheckCircle className="text-green-500 mr-2" size={24} />
      <span className="text-gray-900 font-medium text-lg">{text}</span>
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
    <div className="mx-10 my-10 p-6 rounded-lg bg-slate-900 shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">
        Why Choose Our Event Booking System?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureItem key={index} text={feature.text} image={feature.image} />
        ))}
      </div>
    </div>
  );
}