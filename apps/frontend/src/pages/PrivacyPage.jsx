import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainNav from '../components/common/MainNav';
import Footer from '../components/common/Footer';

export default function PrivacyPage() {
  const navigate = useNavigate();
  return (
    <>
      <MainNav />
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white" style={{ marginTop: '0px' }}>
          <h1 className="text-4xl font-display font-bold mb-8 text-purple-600 tracking-tight">Privacy Policy</h1>
          <div className="max-w-2xl w-full space-y-6 mb-16">
            <div className="group transition-all duration-300">
              <h2 className="text-xl font-heading font-semibold mb-2 text-purple-500 group-hover:underline transition-colors duration-200">Your Privacy Matters</h2>
              <p className="text-gray-700 group-hover:text-purple-600 transition-colors duration-200 font-body">We value your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.</p>
            </div>
            <div className="group transition-all duration-300">
              <h2 className="text-xl font-heading font-semibold mb-2 text-purple-500 group-hover:underline transition-colors duration-200">Information We Collect</h2>
              <p className="text-gray-700 group-hover:text-purple-600 transition-colors duration-200 font-body">We collect information you provide when you sign up, book events, or contact support. We also collect usage data to improve our services.</p>
            </div>
            <div className="group transition-all duration-300">
              <h2 className="text-xl font-heading font-semibold mb-2 text-purple-500 group-hover:underline transition-colors duration-200">How We Use Your Data</h2>
              <p className="text-gray-700 group-hover:text-purple-600 transition-colors duration-200 font-body">Your data is used to provide and improve our services, communicate with you, and ensure your safety and security on the platform.</p>
            </div>
            <div className="group transition-all duration-300">
              <h2 className="text-xl font-heading font-semibold mb-2 text-purple-500 group-hover:underline transition-colors duration-200">Contact</h2>
              <p className="text-gray-700 group-hover:text-purple-600 transition-colors duration-200 font-body">For privacy-related questions, email <a href="mailto:privacy@bichance.com" className="text-purple-600 underline hover:text-purple-800 transition-colors">privacy@bichance.com</a>.</p>
            </div>
          </div>
        </div>
        <Footer />
    </>
  );
} 