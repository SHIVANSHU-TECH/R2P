"use client";
import { motion } from 'framer-motion';
import { useAuthState } from 'react-firebase-hooks/auth';
// import { getFirebaseAuth } from '../lib/firebase/firebase';
import { auth } from '../lib/firebase/firebase';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import type { Auth } from 'firebase/auth';


import { Variants } from 'framer-motion';

export default function Home() {
  // Properly type the auth object for useAuthState
  const [user] = useAuthState(auth);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('features');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const MotionDiv = dynamic(
    () => import('framer-motion').then((mod) => mod.motion.div),
    { ssr: false }
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };
  
  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "Basic portfolio template",
        "Resume parsing",
        "1 custom domain",
        "Export as PDF"
      ]
    },
    {
      name: "Pro",
      price: "$9",
      period: "monthly",
      popular: true,
      features: [
        "All Free features",
        "10 premium templates",
        "Analytics dashboard",
        "SEO optimization",
        "Remove watermark"
      ]
    },
    {
      name: "Business",
      price: "$19",
      period: "monthly",
      features: [
        "All Pro features",
        "Custom branding",
        "Team collaboration",
        "API access",
        "Priority support"
      ]
    }
  ];

  const aboutFeatures = [
    {
      title: "Our Mission",
      content: "We're transforming how job seekers present themselves in the digital age.",
      icon: "🚀"
    },
    {
      title: "Founded",
      content: "Established in 2023 by a team of designers and developers.",
      icon: "🏛️"
    },
    {
      title: "Technology",
      content: "Built with cutting-edge AI and modern web technologies.",
      icon: "💻"
    },
    {
      title: "Community",
      content: "Join thousands of professionals already using Resume2Portfolio.",
      icon: "👥"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <motion.nav 
        className="flex justify-between items-center p-6 bg-white shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
      >
        <Link href="/" className="text-xl font-bold text-blue-600">
          Resume2Portfolio
        </Link>
        
        <div className="hidden md:flex space-x-6 items-center">
          {[
            { name: "Features", id: "features" },
            { name: "Pricing", id: "pricing" },
            { name: "About", id: "about" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`px-3 py-1 rounded-md ${
                activeSection === item.id ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
        
        {!user ? (
          <div className="flex space-x-4">
            <Link
              href="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
            <Link
              href="/signin"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              Login
            </Link>
          </div>
        ) : (
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Dashboard
          </Link>
        )}
      </motion.nav>

      {/* Main content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
        className="py-12 px-4 max-w-7xl mx-auto"
      >
        {/* Hero section */}
        <MotionDiv variants={itemVariants} className="mb-16 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 text-gray-800"
            variants={itemVariants}
          >
            Transform Your <span className="text-blue-600">Resume</span> into a <span className="text-blue-600">Portfolio</span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-8"
          >
            Create a stunning digital portfolio in minutes. Upload your resume and watch it transform into an interactive showcase of your skills and achievements.
          </motion.p>

          <MotionDiv variants={itemVariants}>
            <Link
              href={user ? "/dashboard" : "/login"}
              className="inline-block px-8 py-3 bg-blue-600 text-white text-lg rounded-md hover:bg-blue-700 transition-colors"
            >
              Start Creating Now
            </Link>
          </MotionDiv>
        </MotionDiv>
        
        {/* Features/Pricing/About tabs */}
        <div className="py-8">
          {/* Features Section */}
          {activeSection === 'features' && (
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mb-16"
            >
              <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
                Powerful Features
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Easy Upload",
                    description: "Simply upload your existing resume and we'll do the rest",
                    icon: "📄"
                  },
                  {
                    title: "Smart Parsing",
                    description: "Our AI automatically organizes your experience and skills",
                    icon: "🧠"
                  },
                  {
                    title: "Beautiful Templates",
                    description: "Choose from dozens of professional, customizable designs",
                    icon: "🎨"
                  }
                ].map((feature, index) => (
                  <MotionDiv 
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.1 + 0.2 }
                    }}
                  >
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </MotionDiv>
                ))}
              </div>
              
              <div className="max-w-4xl mx-auto mt-20">
                <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">See How It Works</h2>
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden shadow-sm flex items-center justify-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    ▶
                  </div>
                </div>
              </div>
            </MotionDiv>
          )}
          
          {/* Pricing Section */}
          {activeSection === 'pricing' && (
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
                Choose Your Plan
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 text-center">
                Find the perfect plan for your portfolio needs
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {pricingPlans.map((plan, index) => (
                  <MotionDiv 
                    key={index}
                    className={`bg-white rounded-lg shadow-sm overflow-hidden ${plan.popular ? 'border-2 border-blue-500' : 'border border-gray-200'}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.2 }
                    }}
                  >
                    {plan.popular && (
                      <div className="bg-blue-600 text-white text-xs font-semibold px-4 py-1 text-center">
                        MOST POPULAR
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-center mb-4">{plan.name}</h3>
                      
                      <div className="text-center mb-6">
                        <div className="inline-flex items-baseline">
                          <span className="text-4xl font-bold text-gray-800">{plan.price}</span>
                          <span className="text-gray-500 ml-1">/{plan.period}</span>
                        </div>
                      </div>
                      
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start text-gray-600">
                            <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <button
                        className={`w-full py-2 px-4 rounded-md font-medium text-white ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'} transition-colors`}
                      >
                        Get Started
                      </button>
                    </div>
                  </MotionDiv>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-gray-600 mb-4">Need a custom plan for your team?</p>
                <button className="font-medium text-blue-600 hover:text-blue-800 transition-colors underline">
                  Contact our sales team
                </button>
              </div>
            </MotionDiv>
          )}
          
          {/* About Section */}
          {activeSection === 'about' && (
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
                About Resume2Portfolio
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 text-center">
                We're on a mission to revolutionize how professionals showcase their talents online
              </p>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Our Story</h3>
                  <p className="text-gray-600 mb-4">
                    Resume2Portfolio was founded in 2023 by a team of designers and developers who recognized that traditional resumes weren't enough to showcase the full range of talents in today's digital economy.
                  </p>
                  <p className="text-gray-600">
                    We built this platform to empower professionals to create impressive digital portfolios without needing design or coding skills. Since launch, we've helped thousands of job seekers stand out in competitive markets.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-2xl font-semibold mb-4 text-gray-800">Our Vision</h3>
                  <p className="text-gray-600 mb-4">
                    We believe everyone deserves to showcase their professional journey in a way that truly represents their unique skills and personality.
                  </p>
                  <p className="text-gray-600">
                    Our goal is to become the leading platform for professional self-representation online, helping millions craft compelling digital narratives that open doors to new opportunities.
                  </p>
                </div>
              </div>
  
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {aboutFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-sm text-center"
                  >
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600">{feature.content}</p>
                  </div>
                ))}
              </div>
  
              <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-3xl mx-auto">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">Join Our Community</h3>
                <p className="text-gray-600 mb-6">
                  Become part of a growing network of professionals transforming how they present themselves online.
                </p>
                <Link
                  href="/signup"
                  className="inline-block px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Get Started Today
                </Link>
              </div>
            </MotionDiv>
          )}
        </div>
      </motion.main>

      {/* Footer section */}
      <footer className="bg-white py-12 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-600">Resume2Portfolio</h3>
              <p className="text-gray-600 mb-4">Your resume, reimagined for the digital age</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Product</h3>
              <ul className="space-y-2">
                {["Features", "Templates", "Examples", "Pricing"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Resources</h3>
              <ul className="space-y-2">
                {["Blog", "Help Center", "Tutorials", "API Docs"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Company</h3>
              <ul className="space-y-2">
                {["About Us", "Careers", "Privacy Policy", "Terms of Service"].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Resume2Portfolio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}