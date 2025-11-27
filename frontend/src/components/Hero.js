import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiImage, FiTrendingUp, FiUsers, FiHeart } from 'react-icons/fi';

const Hero = ({ onGetStarted }) => {
  // Sample background images (you can replace with actual image URLs)
  const backgroundImages = [
    'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop'
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-3 gap-2 p-4 h-full">
          {backgroundImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative overflow-hidden rounded-lg"
            >
              <img
                src={image}
                alt={`Creative work ${index + 1}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animated Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-background/90 to-pink-900/80" />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 25, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-32 right-16 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 right-10 w-24 h-24 bg-gradient-primary/10 rounded-full blur-xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-sm font-medium mb-6"
          >
            <FiTrendingUp className="w-4 h-4 mr-2" />
            Join 5,000+ creators worldwide
          </motion.div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Your Creative{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
              Pinterest
            </span>
            <br />
            <span className="text-4xl sm:text-5xl lg:text-6xl">Discover, Pin, Share</span>
          </h1>

          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Unleash your creativity with millions of inspiring images. Save your favorites,
            share your work, and connect with a community of passionate creators.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg flex items-center justify-center min-w-[200px]"
          >
            Start Creating Free
            <FiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 backdrop-blur-sm flex items-center justify-center min-w-[200px]"
          >
            <FiImage className="mr-2 w-5 h-5" />
            Explore Gallery
          </motion.button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center items-center gap-6 text-gray-400 text-sm mb-12"
        >
          <div className="flex items-center">
            <FiHeart className="w-4 h-4 mr-2 text-pink-400" />
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center">
            <FiUsers className="w-4 h-4 mr-2 text-purple-400" />
            <span>Free Forever</span>
          </div>
          <div className="flex items-center">
            <FiTrendingUp className="w-4 h-4 mr-2 text-green-400" />
            <span>Join in Seconds</span>
          </div>
        </motion.div>

        {/* Enhanced Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">12.5K+</div>
            <div className="text-gray-400 text-sm">Images Shared</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">5.2K+</div>
            <div className="text-gray-400 text-sm">Active Creators</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">45K+</div>
            <div className="text-gray-400 text-sm">Posts Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">94%</div>
            <div className="text-gray-400 text-sm">Engagement Rate</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;