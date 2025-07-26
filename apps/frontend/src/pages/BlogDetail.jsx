import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

const fallbackPosts = [
  {
    id: 1,
    title: 'Meet 5 Women Over Dinner',
    image: '/3.jpg',
    content: 'Full story about meeting 5 women over dinner. This is the detailed content for the blog post.'
  },
  {
    id: 2,
    title: 'Beyond Small Talk: The Courage to Connect',
    image: '/4.jpg',
    content: 'Full story about going beyond small talk. This is the detailed content for the blog post.'
  },
  {
    id: 3,
    title: 'The Expat Experiences — You’re Not Alone',
    image: '/5.jpg',
    content: 'Full story about expat experiences. This is the detailed content for the blog post.'
  },
  {
    id: 4,
    title: 'Why We Dine With Strangers',
    image: '/6.webp',
    content: 'Full story about why we dine with strangers. This is the detailed content for the blog post.'
  }
];

const BlogDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  let post = location.state?.post;
  if (!post) {
    post = fallbackPosts.find(p => String(p.id) === String(id));
  }
  if (!post) return <div className="min-h-screen flex items-center justify-center text-2xl">Post not found.</div>;
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
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
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent cursor-pointer" 
                    onClick={() => navigate('/')}>bichance</span>
            </motion.div>
            <div className="hidden md:flex items-center space-x-8">
              <motion.button 
                onClick={() => navigate('/about')} 
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >About</motion.button>
              <motion.button 
                onClick={() => navigate('/blog')} 
                className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >Blog</motion.button>
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
      <div className="pt-20" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button onClick={() => navigate('/blog')} className="mb-6 text-red-600 hover:underline font-semibold">&larr; Back to Blog</button>
        <img src={post.image} alt={post.title} className="w-full h-80 object-cover rounded-xl mb-8 shadow-lg" />
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>
        <div className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</div>
      </div>
    </div>
  );
};

export default BlogDetail; 