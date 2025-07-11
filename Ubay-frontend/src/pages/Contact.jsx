import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitMessage('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitMessage('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(''), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-navy-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl text-orange-500 font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-orange-500">We'd love to hear from you!</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Form */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Send us a message</h2>
              
              {submitMessage && (
                <div className={`mb-6 p-4 rounded ${submitMessage.includes('Thank you') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {submitMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-navy-900 font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-navy-900 font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="message" className="block text-navy-900 font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-md flex items-center justify-center transition duration-300"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:w-1/2">
            <div className="bg-white border-2 border-navy-900 rounded-lg shadow-lg p-8 h-full">
              <h2 className="text-2xl font-bold text-navy-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-orange-500 p-3 rounded-full mr-4">
                    <FiMail className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-navy-900">Email</h3>
                    <p className="text-navy-900">support@ubay.com</p>
                    <p className="text-navy-900">sales@ubay.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-500 p-3 rounded-full mr-4">
                    <FiPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-navy-900">Phone</h3>
                    <p className="text-navy-900">+1 (555) 123-4567</p>
                    <p className="text-navy-900">Mon-Fri: 9am-5pm EST</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-500 p-3 rounded-full mr-4">
                    <FiMapPin className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-navy-900">Headquarters</h3>
                    <p className="text-navy-900">123 Commerce Street</p>
                    <p className="text-navy-900">New York, NY 10001</p>
                    <p className="text-navy-900">United States</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-bold text-lg mb-4 text-navy-900">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-navy-900 hover:bg-navy-800 text-white p-3 rounded-full transition duration-300">
                    <span className="sr-only">Facebook</span>
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="bg-navy-900 hover:bg-navy-800 text-white p-3 rounded-full transition duration-300">
                    <span className="sr-only">Twitter</span>
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="bg-navy-900 hover:bg-navy-800 text-white p-3 rounded-full transition duration-300">
                    <span className="sr-only">Instagram</span>
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className="bg-navy-900 hover:bg-navy-800 text-white p-3 rounded-full transition duration-300">
                    <span className="sr-only">LinkedIn</span>
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-navy-900 mb-6 text-center">Our Location</h2>
          <div className="bg-white p-1 rounded-lg shadow-xl border-2 border-navy-900">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215209132576!2d-73.9878449240146!3d40.74844047138976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;