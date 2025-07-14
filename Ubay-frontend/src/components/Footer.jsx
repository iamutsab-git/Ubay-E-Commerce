import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaMapMarkerAlt, FaPhone} from 'react-icons/fa';
import { FcAbout } from "react-icons/fc";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 px-4  sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Logo & About */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-amber-500">Ubay</h3>
          <p className="text-gray-300">
            Seamless Shopping, Anytime, Anywhere
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-300">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-300">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-300">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-300">
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="/" className="flex items-center text-gray-400 hover:text-amber-500 transition-colors duration-300"><FaMapMarkerAlt className="mr-2" /> Home</a></li>
            <li><a href="/about" className="flex items-center text-gray-400 hover:text-amber-500 transition-colors duration-300"><FcAbout className="mr-2" /> About</a></li>
            <li><a href="/contact" className="flex items-center text-gray-400 hover:text-amber-500 transition-colors duration-300"><FaPhone className="mr-2" /> Contact Us</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-300">FAQs</a></li>
            <li><a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-300">Returns Policy</a></li>
            <li><a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-300">Privacy Policy</a></li>
            <li><a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-300">Terms of Service</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
          <p className="text-gray-300 mb-4">Subscribe to our newsletter</p>
          <form className="flex">
            <input 
              type="email" 
              name='email'
              placeholder="Your email" 
              className="px-4 py-2 w-full rounded-l-md focus:outline-none bg-amber-50 text-gray-900"
              required
            />
            <button 
              type="submit" 
              className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-r-md transition-colors duration-300 flex items-center"
            >
              <FaEnvelope className="mr-2" /> Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800">
                <p className="text-center text-gray-400">
          &copy; {new Date().getFullYear()} Ubay. All rights reserved.
        </p>
      </div>
    </footer>

    
  );
};

export default Footer;