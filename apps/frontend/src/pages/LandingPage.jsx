import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import CountdownTimer from '../components/CountdownTimer';
import HowItWorksCard from '../components/HowItWorksCard';
import MapSection from '../components/MapSection';
import { AlignCenter, ArrowRight, Users, Calendar, Star, Heart, Phone, Mail, Clock, MapPin } from 'lucide-react';
import MobileNavBar from '../components/common/MobileNavBar';
import Footer from '../components/common/Footer';

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // For horizontal scroll and auto-slide on mobile
  const howItWorksRef = useRef(null);
  const featuresRef = useRef(null);
  const restaurantSelectRef = useRef(null);
  const testimonialsRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Add touch event listener for horizontal scroll containers
    document.addEventListener('touchstart', handleHorizontalScrollTouch, { passive: false });
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('touchstart', handleHorizontalScrollTouch);
    };
  }, []);

  // Auto-slide logic for "How it works" cards
  useEffect(() => {
    if (!isMobile || !howItWorksRef.current) return;
    const container = howItWorksRef.current;
    let index = 0;
    const cards = container.children;
    const slide = () => {
      if (!container) return;
      index = (index + 1) % cards.length;
      container.scrollTo({
        left: cards[index].offsetLeft,
        behavior: 'smooth',
      });
    };
    const interval = setInterval(slide, 3000);
    return () => clearInterval(interval);
  }, [isMobile]);

  // Smooth auto-slide logic for "Why Choose" cards
  useEffect(() => {
    if (!isMobile || !featuresRef.current) return;
    const container = featuresRef.current;
    let index = 0;
    const cards = container.children;
    let isPaused = false;
    let interval;
    let isUserScrolling = false;

    const slide = () => {
      if (!container || isPaused || isUserScrolling) return;
      index = (index + 1) % cards.length;
      
      // Smooth scroll with better timing
      const targetScroll = cards[index].offsetLeft;
      const startScroll = container.scrollLeft;
      const distance = targetScroll - startScroll;
      const duration = 800; // 800ms for smooth transition
      const startTime = performance.now();

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        container.scrollLeft = startScroll + (distance * easeOutQuart);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
    };

    const startAutoSlide = () => {
      interval = setInterval(slide, 3500);
    };

    const pauseAutoSlide = () => {
      isPaused = true;
      if (interval) {
        clearInterval(interval);
      }
    };

    const resumeAutoSlide = () => {
      isPaused = false;
      startAutoSlide();
    };

    // Start auto-slide
    startAutoSlide();

    // User interaction handlers
    let scrollTimeout;
    const handleUserScroll = () => {
      isUserScrolling = true;
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 1000);
    };

    const handleTouchStart = () => {
      pauseAutoSlide();
    };

    const handleTouchEnd = () => {
      setTimeout(resumeAutoSlide, 1500);
    };

    container.addEventListener('scroll', handleUserScroll);
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (interval) clearInterval(interval);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      container.removeEventListener('scroll', handleUserScroll);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  // Smooth auto-slide logic for 'How We Select Our Restaurants' cards
  useEffect(() => {
    if (!isMobile || !restaurantSelectRef.current) return;
    const container = restaurantSelectRef.current;
    let index = 0;
    const cards = container.children;
    let isPaused = false;
    let interval;
    let isUserScrolling = false;

    const slide = () => {
      if (!container || isPaused || isUserScrolling) return;
      index = (index + 1) % cards.length;
      
      // Smooth scroll with better timing
      const targetScroll = cards[index].offsetLeft;
      const startScroll = container.scrollLeft;
      const distance = targetScroll - startScroll;
      const duration = 800; // 800ms for smooth transition
      const startTime = performance.now();

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        container.scrollLeft = startScroll + (distance * easeOutQuart);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
    };

    const startAutoSlide = () => {
      interval = setInterval(slide, 4000);
    };

    const pauseAutoSlide = () => {
      isPaused = true;
      if (interval) {
        clearInterval(interval);
      }
    };

    const resumeAutoSlide = () => {
      isPaused = false;
      startAutoSlide();
    };

    // Start auto-slide
    startAutoSlide();

    // User interaction handlers
    let scrollTimeout;
    const handleUserScroll = () => {
      isUserScrolling = true;
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 1000);
    };

    const handleTouchStart = () => {
      pauseAutoSlide();
    };

    const handleTouchEnd = () => {
      setTimeout(resumeAutoSlide, 1500);
    };

    container.addEventListener('scroll', handleUserScroll);
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (interval) clearInterval(interval);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      container.removeEventListener('scroll', handleUserScroll);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  // Smooth auto-slide logic for testimonials (reviews) cards
  useEffect(() => {
    if (!isMobile || !testimonialsRef.current) return;
    const container = testimonialsRef.current;
    let index = 0;
    const cards = container.children;
    let isPaused = false;
    let interval;
    let isUserScrolling = false;

    const slide = () => {
      if (!container || isPaused || isUserScrolling) return;
      index = (index + 1) % cards.length;
      
      // Smooth scroll with better timing
      const targetScroll = cards[index].offsetLeft;
      const startScroll = container.scrollLeft;
      const distance = targetScroll - startScroll;
      const duration = 800; // 800ms for smooth transition
      const startTime = performance.now();

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        container.scrollLeft = startScroll + (distance * easeOutQuart);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
    };

    const startAutoSlide = () => {
      interval = setInterval(slide, 3800);
    };

    const pauseAutoSlide = () => {
      isPaused = true;
      if (interval) {
        clearInterval(interval);
      }
    };

    const resumeAutoSlide = () => {
      isPaused = false;
      startAutoSlide();
    };

    // Start auto-slide
    startAutoSlide();

    // User interaction handlers
    let scrollTimeout;
    const handleUserScroll = () => {
      isUserScrolling = true;
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        isUserScrolling = false;
      }, 1000);
    };

    const handleTouchStart = () => {
      pauseAutoSlide();
    };

    const handleTouchEnd = () => {
      setTimeout(resumeAutoSlide, 1500);
    };

    container.addEventListener('scroll', handleUserScroll);
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (interval) clearInterval(interval);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      container.removeEventListener('scroll', handleUserScroll);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile]);

  // Hero videos for slider
  const heroVideos = [
    '/hero1.mp4',
    '/h2 (1).mp4',
    '/h2 (2).mp4',
    '/h2 (3).mp4',
   
  ];

  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIdx((prev) => (prev + 1) % heroVideos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroVideos.length]);

  const handleJoinNow = () => {
    // Always go to onboarding welcome for new users
    // Existing users will be redirected appropriately after login
    navigate('/onboarding-welcome');
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  // Touch to scroll functionality for cards
  const handleCardTouch = (containerRef, cardIndex, event) => {
    if (!isMobile || !containerRef.current) return;
    
    // Don't prevent default - allow page scroll to continue
    // Only handle the card scroll animation
    
    const container = containerRef.current;
    const cards = container.children;
    
    if (cards[cardIndex]) {
      const targetScroll = cards[cardIndex].offsetLeft;
      const startScroll = container.scrollLeft;
      const distance = targetScroll - startScroll;
      const duration = 400; // Faster response for better UX
      const startTime = performance.now();

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        container.scrollLeft = startScroll + (distance * easeOutQuart);
        
        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };
      
      requestAnimationFrame(animateScroll);
    }
  };

  // Enhanced touch handling for horizontal scroll containers
  const handleHorizontalScrollTouch = (event) => {
    // Only handle horizontal scroll containers
    const target = event.target.closest('.horizontal-scroll');
    if (target) {
      // Allow both horizontal and vertical scrolling naturally
      // Don't interfere with page scrolling
      const touch = event.touches[0];
      const startX = touch.clientX;
      const startY = touch.clientY;
      
      const handleTouchMove = (e) => {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = Math.abs(currentX - startX);
        const deltaY = Math.abs(currentY - startY);
        
        // Only enhance horizontal scroll if user is clearly doing horizontal gesture
        if (deltaX > deltaY * 2 && deltaX > 10) {
          // Smooth horizontal scrolling
          e.preventDefault();
          const scrollAmount = (startX - currentX) * 1.5; // Enhanced sensitivity
          target.scrollLeft += scrollAmount;
        }
        // Otherwise, let the browser handle normal scrolling
      };
      
      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove, { passive: false });
        document.removeEventListener('touchend', handleTouchEnd);
      };
      
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }
  };

  // Features data
  const features = [
    {
      icon: "🤝",
      title: "Meaningful Connections",
      description: "Connect with like-minded individuals who share your interests and values."
    },
    {
      icon: "🎯",
      title: "AI-Powered Matching",
      description: "Our advanced algorithm ensures you're matched with compatible dinner companions."
    },
    {
      icon: "🍽️",
      title: "Curated Experiences",
      description: "Handpicked restaurants and venues for the perfect dining atmosphere."
    },
    {
      icon: "🌟",
      title: "Safe & Secure",
      description: "Verified members and secure platform for worry-free social dining."
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Manager",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      text: "I was nervous about meeting strangers, but the AI matching was spot-on. We had such a great conversation that we're planning our next dinner together!"
    },
    {
      name: "Marcus Johnson",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      text: "Bichance helped me break out of my routine and meet amazing people. The dinner experience was incredible - great food, better company!"
    },
    {
      name: "Emma Rodriguez",
      role: "Graphic Designer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      text: "As someone who works remotely, I was craving real human connection. Bichance delivered exactly that - authentic conversations and new friendships."
    }
  ];

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardHover = {
    hover: {
      y: -10,
      scale: 1.02,
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen bg-white smooth-scroll momentum-scroll"
      style={{ 
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'auto'
      }}
    >
      {/* Top Bar */}
      <div className="bg-purple-800 text-white py-2 relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="absolute top-0 left-0 w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
            animate={{
              x: [0, -30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm relative z-10">
          <div className="flex items-center space-x-6 mb-2 md:mb-0">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Phone className="w-4 h-4" />
              <span>+1 234 567 8900</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Mail className="w-4 h-4" />
              <span>hello@bichance.com</span>
            </motion.div>
          </div>
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Clock className="w-4 h-4" />
            <span>Every Wednesday • 7:00 PM</span>
          </motion.div>
        </div>
      </div>

        {/* Navigation */}
        <motion.nav 
        className="bg-white shadow-lg sticky top-0 z-50"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
                             <motion.div 
                 className="flex items-center"
                whileHover={{ scale: 1.05 }}
               >
                <h1 className="text-3xl font-display font-bold text-purple-800 tracking-tight">Bichance</h1>
               </motion.div>
               
               <div className="hidden md:flex items-center space-x-8">
                 <motion.button 
                   onClick={() => navigate('/about')} 
                  className="text-gray-700 hover:text-purple-600 font-heading font-medium transition-colors duration-300 relative group"
                   whileHover={{ scale: 1.05 }}
                 >
                   About
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                 </motion.button>
                 <motion.button 
                   onClick={() => navigate('/blog')} 
                  className="text-gray-700 hover:text-purple-600 font-heading font-medium transition-colors duration-300 relative group"
                   whileHover={{ scale: 1.05 }}
                 >
                   Blog
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                 </motion.button>
                 <motion.button 
                   onClick={() => navigate('/contact-us')} 
                  className="text-gray-700 hover:text-purple-600 font-heading font-medium transition-colors duration-300 relative group"
                   whileHover={{ scale: 1.05 }}
                 >
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
                 </motion.button>
                 <motion.button 
                   onClick={handleJoinNow}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-heading font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                   whileHover={{ scale: 1.05, y: -2 }}
                   whileTap={{ scale: 0.95 }}
                 >
                   Join Now
                  <ArrowRight className="w-4 h-4" />
                 </motion.button>
               </div>
               
               <div className="md:hidden">
                 <button 
                   onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-700 hover:text-purple-600 p-2"
                 >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                className="md:hidden bg-white border-t border-gray-100 py-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col space-y-3">
                                    <motion.button 
                    onClick={() => navigate('/about')} 
                   className="text-gray-700 hover:text-purple-600 text-left px-4 py-2 transition-colors font-heading font-medium"
                    whileHover={{ x: 10 }}
                  >
                    About
                  </motion.button>
                  <motion.button 
                    onClick={() => navigate('/blog')} 
                   className="text-gray-700 hover:text-purple-600 text-left px-4 py-2 transition-colors font-heading font-medium"
                    whileHover={{ x: 10 }}
                  >
                    Blog
                  </motion.button>
                  <motion.button 
                    onClick={() => navigate('/contact-us')} 
                   className="text-gray-700 hover:text-purple-600 text-left px-4 py-2 transition-colors font-heading font-medium"
                    whileHover={{ x: 10 }}
                  >
                    Contact
                  </motion.button>
                  <motion.button 
                    onClick={handleJoinNow}
                   className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full mx-4 font-heading font-semibold flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Join Now
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        </motion.nav>
        
            {/* Hero Section with Sliding Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Sliding Background Videos */}
        <div className="absolute inset-0">
          {heroVideos.map((video, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: heroIdx === index ? 1 : 0,
                scale: heroIdx === index ? 1 : 1.1
              }}
              transition={{ 
                duration: 1.5,
                ease: "easeInOut"
              }}
            >
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                style={{ display: heroIdx === index ? 'block' : 'none' }}
              >
                <source src={video} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-purple-800/50 to-purple-900/70"></div>
            </motion.div>
          ))}
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-purple-200/20 rounded-full"
            animate={{
              y: [0, -20, 0],
              x: [0, 10, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-24 h-24 bg-purple-300/20 rounded-full"
            animate={{
              y: [0, 20, 0],
              x: [0, -15, 0],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/4 w-20 h-20 bg-purple-400/20 rounded-full"
            animate={{
              y: [0, -15, 0],
              x: [0, 20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >

            
            <motion.h2 
              className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight tracking-tight"
              variants={fadeInUp}
              animate={{ 
                y: [0, -5, 0],
                textShadow: [
                  "0 0 10px rgba(255, 255, 255, 0.3)",
                  "0 0 20px rgba(255, 255, 255, 0.5)",
                  "0 0 10px rgba(255, 255, 255, 0.3)"
                ]
              }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              EVERY WEDNESDAY
              <br />
              <span className="text-purple-300 font-heading">STRANGERS MEET</span>
              <br />
              FOR DINNER
            </motion.h2>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-purple-100 font-body font-medium max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Book your seat now and meet 5 strangers over dinner, all matched by our AI personality algorithm.
            </motion.p>
            
            <div className="mb-8">
              <CountdownTimer />
            </div>
            
            <motion.button
              onClick={handleJoinNow}
              className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 rounded-full text-xl font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 mx-auto relative overflow-hidden group"
              variants={fadeInUp}
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <span className="relative z-10">Book Your Table Now</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroVideos.map((_, index) => (
            <motion.button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                heroIdx === index ? 'bg-purple-400 scale-125' : 'bg-white/50'
              }`}
              onClick={() => setHeroIdx(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
        

      </section>

      {/* Welcome Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-10 right-10 w-40 h-40 bg-purple-100 rounded-full opacity-30"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 90, 180],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-32 h-32 bg-purple-200 rounded-full opacity-30"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [180, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-50 rounded-full opacity-20"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 px-4 relative z-10">
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-8 leading-tight tracking-tight">
              Welcome to 
              <span className="text-purple-600 font-heading"> Bichance</span>
            </h2>
            <div className="space-y-6 text-lg md:text-xl text-gray-600 leading-relaxed font-body">
              <p>Five people have gathered around a table—complete strangers from different walks of life, sharing a meal for the first time. There's a mix of nerves and excitement in the air.</p>
              <p>Slowly, something unexpected starts to happen: real conversation, unfiltered laughter (the kind that doesn't need a <span role='img' aria-label='smile'>😂</span>).</p>
              <p>The sixth seat is still empty—and it has your name on it. Join them for a night that might just surprise you.</p>
                </div>
            <motion.button
              onClick={handleJoinNow}
              className="bg-purple-600 text-white font-bold px-8 py-4 rounded-full shadow-xl hover:bg-purple-700 transition-all duration-300 mt-8 flex items-center gap-3 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Book Your Table
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
          <motion.div 
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <motion.img 
                src="/hero.jpg" 
                alt="Dinner Table" 
                className="rounded-2xl shadow-2xl w-full max-w-lg"
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl blur-xl opacity-30 -z-10"></div>
              </div>
          </motion.div>
                </div>
      </section>

            {/* How It Works Section - Step-wise Flow */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-purple-100 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-20 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-30"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.div
            className="absolute bottom-20 left-20 w-24 h-24 bg-purple-300 rounded-full opacity-30"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-7xl font-display font-bold text-gray-900 mb-6 tracking-tight">
              How it 
              <span className="text-purple-600 font-heading"> works</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-body">
              Your journey from stranger to friend in just a few simple steps
            </p>
          </motion.div>

          {/* Step-wise Flow Cards */}
          <div className="space-y-16">
            {[
              {
                step: "01",
                title: "Tell us more about you",
                description: "Take a quick personality quiz, so we can match you with a group that vibes with your energy.",
                image: "/2.jpg",
                color: "from-purple-500 to-purple-600",
                bgColor: "bg-purple-50"
              },
              {
                step: "02", 
                title: "Pick your dining date",
                description: "Choose from curated dining events near you—because good conversations start over great meals!",
                image: "/3.jpg",
                color: "from-purple-600 to-purple-700",
                bgColor: "bg-purple-100"
              },
              {
                step: "03",
                title: "Get matched with like-minded individuals", 
                description: "Our algorithm connects you with five others for an exciting social dining experience.",
                image: "/4.jpg",
                color: "from-purple-700 to-purple-800",
                bgColor: "bg-purple-200"
              },
              {
                step: "04",
                title: "Dine, laugh & connect",
                description: "Meet up, break the ice, and let the conversations (and connections) flow naturally!",
                image: "/5.jpg",
                color: "from-purple-800 to-purple-900",
                bgColor: "bg-purple-300"
              },
              {
                step: "05",
                title: "Stay connected & keep stepping out",
                description: "Choose who you want to stay connected with and keep the conversation flowing.",
                image: "/6.webp",
                color: "from-purple-900 to-purple-950",
                bgColor: "bg-purple-400"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                viewport={{ once: true, margin: "-100px" }}
                className={`relative ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex flex-col md:flex-row items-center gap-12`}
              >
                {/* Step Number */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2 + 0.3,
                    type: "spring",
                    stiffness: 200
                  }}
                  viewport={{ once: true }}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 md:left-0 md:translate-x-0 z-20"
                >
                  <div className={`w-20 h-20 bg-gradient-to-r ${step.color} text-white rounded-full flex items-center justify-center font-black text-2xl shadow-2xl border-4 border-white`}>
                    {step.step}
                </div>
                </motion.div>

                {/* Content Card */}
                <motion.div
                  className={`flex-1 ${step.bgColor} rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 group`}
                  whileHover={{ 
                    scale: 1.02,
                    y: -5
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2 + 0.1
                  }}
                  viewport={{ once: true }}
                >
                  <div className="md:pt-8">
                    <h3 className="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-4 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed font-body">
                      {step.description}
                    </p>
              </div>
                </motion.div>

                {/* Image */}
                <motion.div
                  className="flex-1 flex justify-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.2 + 0.2
                  }}
                  viewport={{ once: true }}
                >
                  <div className="relative group">
                    <motion.img 
                      src={step.image} 
                      alt={step.title} 
                      className="w-full max-w-md rounded-2xl shadow-2xl"
                      whileHover={{ 
                        scale: 1.05,
                        rotateY: 5
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className={`absolute -inset-4 bg-gradient-to-r ${step.color} rounded-2xl blur-xl opacity-20 -z-10 group-hover:opacity-30 transition-opacity duration-300`}></div>
                </div>
                </motion.div>

                {/* Connecting Line */}
                {index < 4 && (
                  <motion.div
                    className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-purple-400 to-purple-600"
                    style={{ top: '100%' }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: index * 0.2 + 0.5
                    }}
                    viewport={{ once: true }}
                  />
                )}
              </motion.div>
            ))}
              </div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <motion.button
              onClick={handleJoinNow}
              className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 rounded-full text-xl font-bold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-3 mx-auto"
              whileHover={{ y: -5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Journey
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          </motion.div>
          </div>
        </section>
        
        {/* Features Section (Why Choose) */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 tracking-tight">
                Why Choose <span className="text-purple-600 font-heading">Bichance</span>?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body">
                We're not just another social platform. We're a community dedicated to meaningful connections and personal growth.
              </p>
            </motion.div>
            {/* Mobile: horizontal scroll, Desktop: grid */}
            <div
              ref={featuresRef}
              className="md:hidden flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide horizontal-scroll card-scroll-container auto-scroll-pause relative"
              style={{ 
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'auto'
              }}
            >
              {/* Auto-scroll indicator */}
              <div className="absolute top-2 right-2 z-10">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
              </div>
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="min-w-[80vw] max-w-xs snap-center bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group border border-purple-100 cursor-pointer"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleCardTouch(featuresRef, index, e)}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 text-purple-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-body">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
            {/* Desktop: grid as before */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center group border border-purple-100"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 text-purple-500">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-body">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <div className="w-full bg-purple-50 pt-12 pb-2">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 text-center mb-2 tracking-tight">Explore <span className="text-purple-600 font-heading">Weekly dinners</span></h2>
          <h3 className="text-2xl md:text-3xl font-heading font-semibold text-purple-600 text-center mb-6">all over the world</h3>
        </div>
        <section className="w-full bg-purple-50 py-0 m-0">
          <MapSection />
        </section>

        {/* How We Select Our Restaurants Section */}
        <section className="py-16 bg-[#FEF7ED]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-12 tracking-tight text-center">How we select our <span className='italic font-display'>restaurants</span></h1>
            <p className="text-lg text-gray-700 text-center mb-10 font-body">We handpick restaurants using carefully tailored criteria to guarantee you the finest dining experiences.</p>
            {/* Mobile: horizontal scroll, Desktop: grid */}
            <div
              ref={restaurantSelectRef}
              className="md:hidden flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide horizontal-scroll card-scroll-container auto-scroll-pause relative"
              style={{ 
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'auto'
              }}
            >
              {/* Auto-scroll indicator */}
              <div className="absolute top-2 right-2 z-10">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
              </div>
              {/* Card 1 */}
              <div 
                className="min-w-[80vw] max-w-xs snap-center bg-[#FEF7ED] rounded-2xl shadow hover:shadow-2xl transition-all duration-300 p-0 flex flex-col items-center group cursor-pointer transform hover:scale-105 border border-gray-200"
                onClick={(e) => handleCardTouch(restaurantSelectRef, 0, e)}
              >
                <img src="https://i.pinimg.com/736x/f2/f1/f6/f2f1f608ecd50a1d2e1356b4c5e744d3.jpg" alt="Selection" className="w-full h-64 object-cover rounded-t-2xl" />
                <div className="w-full flex flex-col items-center -mt-6 pb-6">
                  <div className="bg-pink-300 rounded-full px-4 py-1 flex items-center mb-2 shadow border border-pink-400">
                    <span className="text-white font-bold mr-2">1</span>
                    <span className="text-pink-900 font-semibold">A wide selection to match your budget</span>
                  </div>
                  <p className="text-gray-700 text-center px-4">Many options, friendly to your wallet.</p>
                </div>
              </div>
              {/* Card 2 */}
              <div 
                className="min-w-[80vw] max-w-xs snap-center bg-[#FEF7ED] rounded-2xl shadow hover:shadow-2xl transition-all duration-300 p-0 flex flex-col items-center group cursor-pointer transform hover:scale-105 border border-gray-200"
                onClick={(e) => handleCardTouch(restaurantSelectRef, 1, e)}
              >
                <img src="https://t4.ftcdn.net/jpg/06/42/41/35/360_F_642413519_HQjYt0mNSg2k11Es5tQq50iebfFoMgDm.jpg" alt="Dietary" className="w-full h-64 object-cover rounded-t-2xl" />
                <div className="w-full flex flex-col items-center -mt-6 pb-6">
                  <div className="bg-yellow-300 rounded-full px-4 py-1 flex items-center mb-2 shadow border border-yellow-400">
                    <span className="text-white font-bold mr-2">2</span>
                    <span className="text-yellow-900 font-semibold">Options to fit your dietary choices</span>
                  </div>
                  <p className="text-gray-700 text-center px-4">Satisfying every palate, one dish at a time!</p>
                </div>
              </div>
              {/* Card 3 */}
              <div 
                className="min-w-[80vw] max-w-xs snap-center bg-[#FEF7ED] rounded-2xl shadow hover:shadow-2xl transition-all duration-300 p-0 flex flex-col items-center group cursor-pointer transform hover:scale-105 border border-gray-200"
                onClick={(e) => handleCardTouch(restaurantSelectRef, 2, e)}
              >
                <img src="https://img.freepik.com/free-photo/young-happy-couple-toasting-with-beer-celebrating-while-enjoying-lunch-with-their-friends-pub_637285-4097.jpg?semt=ais_hybrid&w=740" alt="Top Rated" className="w-full h-64 object-cover rounded-t-2xl" />
                <div className="w-full flex flex-col items-center -mt-6 pb-6">
                  <div className="bg-teal-400 rounded-full px-4 py-1 flex items-center mb-2 shadow border border-teal-500">
                    <span className="text-white font-bold mr-2">3</span>
                    <span className="text-teal-900 font-semibold">Top Rated restaurants only</span>
                  </div>
                  <p className="text-gray-700 text-center px-4">Handpicked and user-approved thanks to feedback.</p>
                </div>
              </div>
            </div>
            {/* Desktop: grid as before */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-[#FEF7ED] rounded-2xl shadow hover:shadow-2xl transition-all duration-300 p-0 flex flex-col items-center group cursor-pointer transform hover:scale-105 border border-gray-200">
                <img src="https://i.pinimg.com/736x/f2/f1/f6/f2f1f608ecd50a1d2e1356b4c5e744d3.jpg" alt="Selection" className="w-full h-64 object-cover rounded-t-2xl" />
                <div className="w-full flex flex-col items-center -mt-6 pb-6">
                  <div className="bg-pink-300 rounded-full px-4 py-1 flex items-center mb-2 shadow border border-pink-400">
                    <span className="text-white font-bold mr-2">1</span>
                    <span className="text-pink-900 font-semibold">A wide selection to match your budget</span>
                  </div>
                  <p className="text-gray-700 text-center px-4">Many options, friendly to your wallet.</p>
                </div>
              </div>
              {/* Card 2 */}
              <div className="bg-[#FEF7ED] rounded-2xl shadow hover:shadow-2xl transition-all duration-300 p-0 flex flex-col items-center group cursor-pointer transform hover:scale-105 border border-gray-200">
                <img src="https://t4.ftcdn.net/jpg/06/42/41/35/360_F_642413519_HQjYt0mNSg2k11Es5tQq50iebfFoMgDm.jpg" alt="Dietary" className="w-full h-64 object-cover rounded-t-2xl" />
                <div className="w-full flex flex-col items-center -mt-6 pb-6">
                  <div className="bg-yellow-300 rounded-full px-4 py-1 flex items-center mb-2 shadow border border-yellow-400">
                    <span className="text-white font-bold mr-2">2</span>
                    <span className="text-yellow-900 font-semibold">Options to fit your dietary choices</span>
                  </div>
                  <p className="text-gray-700 text-center px-4">Satisfying every palate, one dish at a time!</p>
                </div>
              </div>
              {/* Card 3 */}
              <div className="bg-[#FEF7ED] rounded-2xl shadow hover:shadow-2xl transition-all duration-300 p-0 flex flex-col items-center group cursor-pointer transform hover:scale-105 border border-gray-200">
                <img src="https://img.freepik.com/free-photo/young-happy-couple-toasting-with-beer-celebrating-while-enjoying-lunch-with-their-friends-pub_637285-4097.jpg?semt=ais_hybrid&w=740" alt="Top Rated" className="w-full h-64 object-cover rounded-t-2xl" />
                <div className="w-full flex flex-col items-center -mt-6 pb-6">
                  <div className="bg-teal-400 rounded-full px-4 py-1 flex items-center mb-2 shadow border border-teal-500">
                    <span className="text-white font-bold mr-2">3</span>
                    <span className="text-teal-900 font-semibold">Top Rated restaurants only</span>
                  </div>
                  <p className="text-gray-700 text-center px-4">Handpicked and user-approved thanks to feedback.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-10">
              <button className="bg-pink-400 hover:bg-pink-500 text-white font-bold px-8 py-3 rounded-full shadow transition-all text-lg" onClick={() => navigate('/auth')}>See Our Restaurants in Your City</button>
            </div>
          </div>
        </section>

        {/* After-Dinner Drinks & Icebreaker Games Section */}
        <section className="py-16 bg-[#FEF7ED]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-10 justify-center items-stretch">
            {/* After-Dinner Drinks Card */}
            <div className="flex-1 bg-white rounded-2xl shadow hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center group cursor-pointer transform hover:scale-105 border border-gray-200">
              <img src="https://i.pinimg.com/236x/f9/9e/ec/f99eeced8f4c360b0afc973e1875e612.jpg" alt="After Dinner Drinks" className="w-full h-64 object-cover rounded-xl mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">AFTER-DINNER <span className="italic font-serif">DRINKS</span></h2>
              <p className="text-gray-700 text-center mb-4">Keep the energy alive — Unlock your Last Drink location in the app an hour after dinner starts.</p>
              <button className="bg-purple-600 hover:bg-purple-800 text-white font-bold px-8 py-3 rounded-full shadow transition-all text-lg hover:shadow-xl hover:scale-105" onClick={() => navigate('/auth')}>Sign Up Now</button>
            </div>
            {/* Icebreaker Games Card */}
            <div className="flex-1 bg-white rounded-2xl shadow hover:shadow-2xl transition-all duration-300 p-8 flex flex-col items-center group cursor-pointer transform hover:scale-105 border border-gray-200">
              <img src="https://res.cloudinary.com/hz3gmuqw6/image/upload/c_fill,q_60,w_750,f_auto/CozymealBlog-13-phproX0ZD" alt="Icebreaker Games" className="w-full h-64 object-cover rounded-xl mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center"><span className="italic font-serif">ICEBREAKER</span> GAMES</h2>
              <p className="text-gray-700 text-center mb-4">We’ll help spark and keep conversation going with icebreaker questions that connect your group.</p>
              <button className="bg-purple-600 hover:bg-purple-800 text-white font-bold px-8 py-3 rounded-full shadow transition-all text-lg hover:shadow-xl hover:scale-105" onClick={() => navigate('/auth')}>Sign Up Now</button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-[#FEF7ED]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-16"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 tracking-tight">
                What Our Members Say
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-body">
                Real stories from real people who stepped out and transformed their lives.
              </p>
            </motion.div>
            {/* Mobile: horizontal scroll, Desktop: grid */}
            <div
              ref={testimonialsRef}
              className="md:hidden flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide horizontal-scroll card-scroll-container auto-scroll-pause relative"
              style={{ 
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'auto'
              }}
            >
              {/* Auto-scroll indicator */}
              <div className="absolute top-2 right-2 z-10">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60"></div>
              </div>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="min-w-[80vw] max-w-xs snap-center bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => handleCardTouch(testimonialsRef, index, e)}
                >
                  <div className="flex items-center mb-6">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-heading font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-red-600 font-heading font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed italic font-body">
                    "{testimonial.text}"
                  </p>
                </motion.div>
              ))}
            </div>
            {/* Desktop: grid as before */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-gray-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-center mb-6">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-heading font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-red-600 font-heading font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed italic font-body">
                    "{testimonial.text}"
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-purple-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
                Ready to Step Out?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto font-body">
                Join thousands of members who have already transformed their social lives. Your next adventure is just one click away.
              </p>
              <motion.button 
                onClick={handleJoinNow}
                className="bg-white text-purple-600 px-12 py-4 rounded-full text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-gray-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Your Journey
              </motion.button>
            </motion.div>
          </div>
        </section>
        
        {/* Footer */}
        <Footer />
      </div>
  );
};

export default LandingPage;
