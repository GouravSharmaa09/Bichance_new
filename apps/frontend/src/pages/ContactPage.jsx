import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email Us',
      details: 'hello@stepout.world',
      description: 'Send us an email anytime'
    },
    {
      icon: '📱',
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri 9AM-6PM EST'
    },
    {
      icon: '📍',
      title: 'Visit Us',
      details: '123 Innovation Drive',
      description: 'San Francisco, CA 94105'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      details: 'Available 24/7',
      description: 'Click the chat bubble'
    }
  ];

  const faqs = [
    {
      question: 'How do I join StepOut?',
      answer: 'Simply click the "Join Now" button and complete our quick registration process. We\'ll guide you through creating your profile and finding your first event.'
    },
    {
      question: 'What types of events do you host?',
      answer: 'We host a variety of events including networking dinners, outdoor adventures, cultural experiences, workshops, and social mixers - all designed to help you meet like-minded people.'
    },
    {
      question: 'Is StepOut safe?',
      answer: 'Absolutely. We verify all members, host events in public venues, and have community guidelines to ensure everyone feels safe and comfortable.'
    },
    {
      question: 'How much does it cost?',
      answer: 'We offer various membership tiers to fit different budgets. Event costs vary depending on the type and location, but we always strive to keep them accessible.'
    }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav 
        className="bg-white/95 backdrop-blur-md border-b border-red-100 shadow-sm fixed w-full z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-2xl font-bold text-red-600 cursor-pointer" 
                    onClick={() => navigate('/')}>
                Bichance
              </span>
            </motion.div>
            <div className="flex items-center space-x-8">
              <motion.button 
                onClick={() => navigate('/')} 
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                Home
              </motion.button>
              <motion.button 
                onClick={() => navigate('/about')} 
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                About
              </motion.button>
              <motion.button 
                onClick={() => navigate('/auth?mode=signup')}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Now
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Get in <span className="text-red-600">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Have questions about Bichance? Want to suggest an event? Or just want to say hello? 
              We'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{info.icon}</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {info.title}
                </h3>
                <p className="text-red-600 font-medium mb-2">
                  {info.details}
                </p>
                <p className="text-gray-600 text-sm">
                  {info.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>
              
              {submitted ? (
                <motion.div
                  className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-green-600">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-green-600 hover:text-green-800 font-medium"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none"
                      placeholder="Tell us more..."
                    />
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      'Send Message'
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Map/Office Info */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Visit Our Office
              </h2>
              
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                <div className="h-64 bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                  <div className="text-center text-red-800">
                    <div className="text-4xl mb-2">📍</div>
                    <p className="font-medium">Interactive Map</p>
                    <p className="text-sm">Would be integrated here</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    Bichance Headquarters
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="text-red-600 mr-3 mt-1">📍</div>
                      <div>
                        <p className="font-medium text-gray-900">Address</p>
                        <p className="text-gray-600">123 Innovation Drive<br />San Francisco, CA 94105</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="text-red-600 mr-3 mt-1">🕒</div>
                      <div>
                        <p className="font-medium text-gray-900">Office Hours</p>
                        <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM<br />Saturday: 10:00 AM - 4:00 PM<br />Sunday: Closed</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="text-red-600 mr-3 mt-1">🚗</div>
                      <div>
                        <p className="font-medium text-gray-900">Parking</p>
                        <p className="text-gray-600">Free visitor parking available in our underground garage</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Got questions? We've got answers. Here are some of the most common questions we receive.
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold mb-3 text-gray-900">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            className="text-center mt-12"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-600 mb-4">
              Still have questions?
            </p>
            <motion.button
              onClick={() => document.querySelector('form').scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ask Us Anything
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Step Out?
            </h2>
            <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
              Don't wait for the perfect moment. The perfect moment is now. Join our community and start your journey today.
            </p>
            <motion.button 
              onClick={() => navigate('/auth?mode=signup')}
              className="bg-white text-red-600 px-12 py-4 rounded-full text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-gray-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Join Bichance Now
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-12 pb-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Logo and tagline */}
          <div className="flex-1 flex flex-col items-center md:items-start mb-8 md:mb-0">
            <img src="/l1.png" alt="bichance logo" style={{ width: 180, height: 80, objectFit: 'cover', margin: '24px 0 16px 0' }} />
            <p className="text-gray-400 text-sm mb-4">Connecting people through meaningful experiences and shared adventures.</p>
            <div className="flex gap-4 mt-2">
              <a href="https://play.google.com/store/games?hl=en_IN&pli=1" target="_blank" rel="noopener noreferrer">
                <img src="https://static.vecteezy.com/system/resources/previews/021/514/852/non_2x/google-play-symbol-brand-logo-with-name-white-design-software-phone-mobile-illustration-with-black-background-free-vector.jpg" alt="Get it on Google Play" className="h-16 transition-transform duration-200 hover:scale-105 hover:shadow-lg rounded-lg" />
              </a>
              <a href="https://www.apple.com/in/app-store/" target="_blank" rel="noopener noreferrer">
                <div className="flex flex-col items-center">
                  <img src="https://i.pinimg.com/736x/60/0b/b7/600bb75fc415bddd8a31fd0377302129.jpg" alt="Download on the App Store" className="h-12 transition-transform duration-200 hover:scale-105 hover:shadow-lg rounded-lg" />
                  <span className="text-white text-xs mt-1 mb-2" style={{ marginTop: '4px' }}>App Store</span>
                </div>
              </a>
            </div>
          </div>
          {/* Links */}
          <div className="flex-1 flex flex-col items-center md:items-end">
            <div className="flex flex-wrap justify-center gap-6 mb-4">
              <a href="#faq" className="text-gray-300 hover:text-white text-sm">FAQ</a>
              <a href="#help" className="text-gray-300 hover:text-white text-sm">Help Center</a>
              <button onClick={() => navigate('/about')} className="text-gray-300 hover:text-white text-sm">About</button>
              <button onClick={() => navigate('/blog')} className="text-gray-300 hover:text-white text-sm">Blog</button>
              <a href="#privacy" className="text-gray-300 hover:text-white text-sm">Privacy Policy</a>
              <a href="#terms" className="text-gray-300 hover:text-white text-sm">Terms & Conditions</a>
            </div>
            <div className="flex gap-4 justify-center md:justify-end mb-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors duration-200"><i className="fab fa-instagram fa-lg"></i> <img src="https://img.freepik.com/premium-vector/black-outline-social-media-logo_197792-2416.jpg?semt=ais_hybrid&w=740" alt="Instagram" style={{ width: 32, height: 32, borderRadius: '50%', marginLeft: 4 }} className="transition-transform duration-200 hover:scale-110 hover:shadow-lg" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors duration-200"><i className="fab fa-twitter fa-lg"></i><img src="https://cdn.worldvectorlogo.com/logos/twitter-logo-2.svg" alt="Twitter" style={{ width: 32, height: 32, borderRadius: '50%', marginLeft: 4 }} className="transition-transform duration-200 hover:scale-110 hover:shadow-lg" /></a>
              <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500 transition-colors duration-200"><i className="fab fa-whatsapp fa-lg"></i><img src="https://static.vecteezy.com/system/resources/previews/014/414/666/non_2x/whatsapp-black-logo-on-transparent-background-free-vector.jpg" alt="WhatsApp" style={{ width: 32, height: 32, borderRadius: '50%', marginLeft: 4 }} className="transition-transform duration-200 hover:scale-110 hover:shadow-lg" /></a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors duration-200"><i className="fab fa-facebook fa-lg"></i><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMW9AB13KyfzyL04pPQ6MNSttPFG3O06v9ig&s" alt="Facebook" style={{ width: 32, height: 32, borderRadius: '50%', marginLeft: 4 }} className="transition-transform duration-200 hover:scale-110 hover:shadow-lg" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-xs">
          <p>&copy; 2025 All rights reserved. bichance</p>
          <img src="/l1.png" alt="bichance logo" style={{ width: 80, margin: '0 auto' }} />
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
