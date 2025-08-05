import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainNav from '../components/common/MainNav';
import Footer from '../components/common/Footer';

export default function FAQPage() {
  const navigate = useNavigate();
  return (
    <>
      <MainNav />
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FEF7ED]" style={{ marginTop: '0px' }}>
        <h1 className="text-4xl font-display font-bold mb-8 text-purple-600 text-center tracking-tight">Frequently Asked Questions</h1>
        <div className="max-w-2xl w-full space-y-6 mb-16">
          <div className="group transition-all duration-300">
            <h2 className="text-xl font-heading font-semibold mb-2 text-purple-500 group-hover:underline transition-colors duration-200">What is bichance?</h2>
            <p className="text-gray-700 group-hover:text-purple-600 transition-colors duration-200 font-body">bichance is a platform to connect people for unique dining and social experiences in your city.</p>
          </div>
          <div className="group transition-all duration-300">
            <h2 className="text-xl font-heading font-semibold mb-2 text-purple-500 group-hover:underline transition-colors duration-200">How do I join a dinner?</h2>
            <p className="text-gray-700 group-hover:text-purple-600 transition-colors duration-200 font-body">Sign up, verify your account, and browse available dinners. Book your spot and enjoy meeting new people!</p>
          </div>
          <div className="group transition-all duration-300">
            <h2 className="text-xl font-heading font-semibold mb-2 text-purple-500 group-hover:underline transition-colors duration-200">Is there a membership fee?</h2>
            <p className="text-gray-700 group-hover:text-purple-600 transition-colors duration-200 font-body">You can browse and join some events for free. Premium experiences may require a subscription or one-time payment.</p>
          </div>
          <div className="group transition-all duration-300">
            <h2 className="text-xl font-heading font-semibold mb-2 text-purple-500 group-hover:underline transition-colors duration-200">How do I contact support?</h2>
            <p className="text-gray-700 group-hover:text-purple-600 transition-colors duration-200 font-body">Use the Contact Us page or email us at support@bichance.com.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 