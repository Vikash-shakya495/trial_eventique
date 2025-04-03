
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-slate-900 py-6 text-white">
    <div className="mx-auto flex flex-col md:flex-row items-center justify-between px-6">
      {/* Social Media Icons */}
      <div className="flex space-x-6 mb-4 md:mb-0">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-500 transition duration-300"
        >
          <FaFacebook className="text-xl" />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-400 transition duration-300"
        >
          <FaTwitter className="text-xl" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-orange-400 transition duration-300"
        >
          <FaInstagram className="text-xl" />
        </a>
      </div>
  
      {/* Navigation Links */}
      <nav>
        <ul className="flex space-x-4 text-sm">
          <li>
            <Link to="/" className="text-gray-300 hover:text-orange-400 transition duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-gray-300 hover:text-orange-400 transition duration-300">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="text-gray-300 hover:text-orange-400 transition duration-300">
              Contact
            </Link>
          </li>
          <li>
            <Link to="/privacy-policy" className="text-gray-300 hover:text-orange-400 transition duration-300">
              Privacy Policy
            </Link>
          </li>
        </ul>
      </nav>
  
      {/* Copyright */}
      <p className="text-xs text-gray-400 mt-4 md:mt-0">
        &copy; {new Date().getFullYear()} Eventify. All Rights Reserved.
      </p>
    </div>
  </footer>
  
  )
}

export default Footer