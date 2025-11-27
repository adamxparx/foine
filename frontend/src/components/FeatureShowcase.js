import React from 'react';
import { motion } from 'framer-motion';

const FeatureShowcase = () => {
  const features = [
    {
      icon: '📤',
      title: 'Upload & Share',
      description: 'Share your creative work with our community. Upload high-quality images and inspire others with your unique perspective.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🔍',
      title: 'Discover & Explore',
      description: 'Find inspiration from millions of creative works. Browse by categories, search for specific styles, and save your favorites.',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: '📌',
      title: 'Organize & Save',
      description: 'Create boards to organize your inspiration. Save posts, create collections, and build your personal creative library.',
      color: 'from-pink-500 to-red-500'
    }
  ];

  return (
    <section className="py-20 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Inspire & Create
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join a thriving community of creators, discover endless inspiration, and share your unique vision with the world.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 h-full hover:bg-gray-800/70 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold text-white mb-4 text-center">{feature.title}</h3>
                <p className="text-gray-300 text-center leading-relaxed">{feature.description}</p>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;