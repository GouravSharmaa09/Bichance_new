import React from 'react';

const SubscriptionCancel = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50">
      <h1 className="text-3xl font-bold text-red-700 mb-4">Subscription Cancelled</h1>
      <p className="mb-2">Your payment was cancelled. You can try again anytime.</p>
      <a href="/dashboard" className="mt-6 px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 transition">Back to Dashboard</a>
    </div>
  );
};

export default SubscriptionCancel; 