import React from 'react';
import Footer from '../components/common/Footer';
import MainNav from '../components/common/MainNav';

const ContactUsPage = () => {
  return (
    <>
      <MainNav />
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FEF7ED]" style={{ marginTop: '0px' }}>
        <div className="max-w-2xl w-full mx-auto p-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in-up" style={{ marginTop: '32px', marginBottom: '32px' }}>
          <h1 className="text-4xl font-display font-bold mb-2 text-purple-600 text-center tracking-tight">Contact Us</h1>
          <p className="text-gray-600 text-center mb-6 font-body">We'd love to hear from you! Fill out the form below or reach out via email or WhatsApp.</p>
          <div className="flex flex-col md:flex-row gap-8 w-full mb-8">
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-2 text-purple-500 font-heading font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10.5a8.38 8.38 0 01-.9 3.8c-.6 1.2-1.5 2.3-2.6 3.2-1.1.9-2.4 1.5-3.8 1.5s-2.7-.6-3.8-1.5c-1.1-.9-2-2-2.6-3.2A8.38 8.38 0 013 10.5C3 6.4 6.4 3 10.5 3S18 6.4 18 10.5z"/><circle cx="12" cy="10.5" r="2.5"/></svg>
                <span>support@bichance.com</span>
              </div>
              <div className="flex items-center gap-2 text-purple-600 font-heading font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.7 20.3l-3.4-3.4c-.4-.4-1-.4-1.4 0l-2.1 2.1c-2.2-1.1-4-2.9-5.1-5.1l2.1-2.1c.4-.4.4-1 0-1.4l-3.4-3.4c-.4-.4-1-.4-1.4 0l-1.7 1.7c-.4.4-.7 1-.7 1.6 0 7.2 5.8 13 13 13 .6 0 1.2-.2 1.6-.7l1.7-1.7c.4-.4.4-1 0-1.4z"/></svg>
                <span>+91 8209427429</span>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-3">
              <div className="flex items-center gap-2 text-purple-600 font-heading font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 2H7a2 2 0 00-2 2v16a2 2 0 002 2h10a2 2 0 002-2V4a2 2 0 00-2-2z"/><path d="M12 18h.01"/></svg>
                <span>Mon-Fri: 10am - 6pm</span>
              </div>
              <div className="flex items-center gap-2 text-purple-500 font-heading font-semibold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2"/><path d="M12 15v-6"/><path d="M9 12h6"/></svg>
                <span>We reply within 24 hours</span>
              </div>
            </div>
          </div>
          <form className="space-y-4 w-full">
            <input type="text" placeholder="Your Name" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm font-body" />
            <input type="email" placeholder="Your Email" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm font-body" />
            <textarea placeholder="Your Message" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm font-body" rows={4}></textarea>
            <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold px-6 py-3 rounded-full shadow-lg transition-all text-lg">Send Message</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUsPage; 