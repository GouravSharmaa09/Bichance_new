import React from 'react';
import { motion } from 'framer-motion';

export default function HowItWorksCard({ number, color, title, description, img, animateOnHover }) {
  return (
    <motion.div
      className={`rounded-xl shadow-lg p-4 flex flex-col items-center text-center ${color} transition-all duration-300 cursor-pointer`}
      whileHover={animateOnHover ? { scale: 1.08, boxShadow: '0 8px 32px rgba(239,68,68,0.25)' } : {}}
    >
      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-3 border-4 border-red-400">
        <span className="text-2xl font-bold text-red-600">{number}</span>
      </div>
      <img src={img} alt={title} className="w-24 h-24 object-cover rounded-lg mb-3 shadow-md" />
      <h3 className="text-lg font-bold text-white mb-2 drop-shadow-lg">{title}</h3>
      <p className="text-white/90 text-base font-medium">{description}</p>
    </motion.div>
  );
} 