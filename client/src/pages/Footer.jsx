
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className=" bg-blue-950 py-6 text-white">
      <div className="mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        {/* Social Media Icons */}
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-xl hover:text-blue-500 transition" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-xl hover:text-blue-400 transition" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-xl hover:text-pink-400 transition" />
          </a>
        </div>
        
        {/* Navigation Links */}
        <nav>
          <ul className="flex space-x-4 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
          </ul>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-gray-300 mt-4 md:mt-0">&copy; {new Date().getFullYear()} Eventify. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default Footer