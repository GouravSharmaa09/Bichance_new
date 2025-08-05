import React from 'react';
import MainNav from '../components/common/MainNav';
import Footer from '../components/common/Footer';

export default function TermsPage() {
  return (
    <>
      <MainNav />
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FEF7ED]" style={{ marginTop: '0px' }}>
        <h1 className="text-4xl font-display font-bold mb-8 text-purple-600 text-center tracking-tight">Terms & Conditions</h1>
        <div className="max-w-3xl mx-auto text-gray-700 text-base space-y-4 font-body">
          <h2 className="text-2xl font-heading font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>By accessing and using bichance, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
          <h2 className="text-2xl font-heading font-semibold mb-2">2. Changes to Terms</h2>
          <p>bichance reserves the right to change these terms at any time. We will notify users of any changes by posting the new terms on this page.</p>
          <h2 className="text-2xl font-heading font-semibold mb-2">3. User Responsibilities</h2>
          <p>Users are responsible for maintaining the confidentiality of their account and password and for restricting access to their computer.</p>
          <h2 className="text-2xl font-heading font-semibold mb-2">4. Limitation of Liability</h2>
          <p>bichance is not liable for any damages that may occur from the use or misuse of our service.</p>
          <h2 className="text-2xl font-heading font-semibold mb-2">5. Contact</h2>
          <p>If you have any questions about these Terms, please contact us at <a href="mailto:support@bichance.com" className="text-purple-600 underline hover:text-purple-800">support@bichance.com</a>.</p>
        </div>
      </div>
      <Footer />
    </>
  );
} 