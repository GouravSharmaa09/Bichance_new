import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MobileNavBar from '../components/common/MobileNavBar';
import FooterNav from '../components/common/FooterNav';
import Footer from '../components/common/Footer';
import MainNav from '../components/common/MainNav';

const blogPosts = [
  {
    id: 1,
    title: 'Meet 5 Women Over Dinner',
    image: '/b1.avif',
    excerpt: 'Stories of connection and new friendships from our weekly dinners.',
    content: 'Full story about meeting 5 women over dinner. This is the detailed content for the blog post.'
  },
  {
    id: 2,
    title: 'Beyond Small Talk: The Courage to Connect',
    image: '/b2.avif',
    excerpt: 'How real conversations at the table can change your perspective.',
    content: 'Full story about going beyond small talk. This is the detailed content for the blog post.'
  },
  {
    id: 3,
    title: 'The Expat Experiences — You’re Not Alone',
    image: '/b3.avif',
    excerpt: 'Finding community and belonging in a new city.',
    content: 'Full story about expat experiences. This is the detailed content for the blog post.'
  },
  {
    id: 4,
    title: 'Why We Dine With Strangers',
    image: '/b6.jpg',
    excerpt: 'The science and stories behind our unique dinner format.',
    content: 'Full story about why we dine with strangers. This is the detailed content for the blog post.'
  }
];

export default function BlogPage() {
  const navigate = useNavigate();
  // Hero carousel images
  const heroImages = ['/b4.jpg', '/b8.jpg', '/b7.webp'];
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <MainNav />
      <div style={{ padding: 0 }} className="bg-white">
        {/* Hero Image with Overlay - now auto-slides */}
        <div className="relative w-full h-[420px] md:h-[600px] flex items-center justify-center fade-in-up overflow-hidden">
          <img src={heroImages[heroIdx]} alt="Blog Hero" className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-in-out" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/30" />
          <div className="relative z-10 text-center w-full">
            <h1
              className="text-5xl md:text-6xl font-display font-bold italic drop-shadow-lg mb-4 tracking-tight"
            >
              <span className="bg-gradient-to-r from-white via-purple-500 to-purple-700 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white italic font-heading font-bold drop-shadow-lg">
              Find out the latest news from Bichance
            </p>
          </div>
        </div>
        {/* Blog Cards Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 fade-in-up mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white/40 backdrop-blur-lg rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in overflow-hidden flex flex-col group transform hover:scale-105">
                <img src={post.image} alt={post.title} className="w-full h-56 object-cover" />
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-heading font-bold mb-2 text-purple-500 group-hover:underline transition-colors duration-200">{post.title}</h3>
                  <p className="text-gray-600 mb-4 flex-1 group-hover:text-purple-600 transition-colors duration-200 font-body">{post.excerpt}</p>
                  <button onClick={() => navigate(`/blog/${post.id}`, { state: { post } })} className="mt-auto bg-purple-500 hover:bg-purple-600 text-white font-bold px-6 py-2 rounded-full transition-all">Read More</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
} 