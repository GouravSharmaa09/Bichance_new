import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MobileNavBar from '../components/common/MobileNavBar';
import FooterNav from '../components/common/FooterNav';
import Footer from '../components/common/Footer';
import MainNav from '../components/common/MainNav';

export default function AboutPage() {
  const navigate = useNavigate();
  
  const stats = [
    { number: "10K+", label: "Active Members" },
    { number: "500+", label: "Events Hosted" },
    { number: "25+", label: "Cities" },
    { number: "98%", label: "Satisfaction Rate" }
  ];

  const team = [
    {
      name: "Alex Thompson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      bio: "Former tech executive who believes in the power of human connection."
    },
    {
      name: "Sarah Williams",
      role: "Head of Community",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b977?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      bio: "Psychology PhD passionate about building meaningful communities."
    },
    {
      name: "David Chen",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      bio: "Tech innovator focused on creating seamless user experiences."
    }
  ];

  const values = [
    {
      icon: "🎯",
      title: "Authenticity",
      description: "We believe in genuine connections and real experiences, not superficial networking."
    },
    {
      icon: "🌟",
      title: "Quality Over Quantity",
      description: "We carefully curate our events and community to ensure meaningful interactions."
    },
    {
      icon: "🚀",
      title: "Growth Mindset",
      description: "Every experience is an opportunity to learn, grow, and expand your horizons."
    },
    {
      icon: "🤝",
      title: "Inclusivity",
      description: "We welcome people from all backgrounds and walks of life to join our community."
    }
  ];

  return (
    <>
      <MainNav />
      <div style={{ padding: 0 }} className="bg-[#FEF7ED]">
        {/* Hero Section */}
        <section className="pt-24 pb-16 bg-[#FEF7ED] fade-in-up">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-red-600">
                The real distance between you and the people you don’t know<br />
                is a warm <span className="font-bold text-red-700">&ldquo;Hello.&rdquo;</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Yet it feels daunting to take that first step, especially in-person.<br /><br />
                This is what <span className="font-bold text-red-700">Bichance</span> is all about. We create opportunities for the magic of chance encounters. The conversations you would have missed, the people you wouldn’t have met. Safe moments to interact with people around you so that you can be more involved with the world you live in.<br /><br />
                Free-fall into social possibilities without digital screens. Open up to the people around you without expectations. Start a conversation, spark a connection. Go out for a dinner with strangers.<br /><br />
                <span className="text-xl md:text-2xl font-semibold text-red-500">Take a chance, have a seat. And just say,</span>
              </p>
              <button className="bg-red-200 hover:bg-black hover:text-white text-red-900 font-bold px-8 py-3 rounded-full shadow transition-all text-lg mt-4" onClick={() => navigate('/auth?mode=signup')}>
                &quot;HELLO STRANGER&quot;
              </button>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-[#FEF7ED]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These core principles guide everything we do and shape the community we're building together.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{value.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-gradient-to-r from-red-500 to-red-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-red-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                To create a world where stepping out of your comfort zone is celebrated, 
                where authentic connections flourish, and where every person has the opportunity 
                to grow through meaningful experiences with others.
              </p>
              <motion.button 
                onClick={() => navigate('/auth?mode=signup')}
                className="bg-white text-red-600 px-8 py-3 rounded-full text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-black hover:text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Our Mission
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
