import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const stats = [
  {
    icon: '🖼️',
    label: 'Images Shared',
    target: 12500,
    suffix: '+',
    key: 'images'
  },
  {
    icon: '👥',
    label: 'Active Creators',
    target: 5200,
    suffix: '+',
    key: 'users'
  },
  {
    icon: '📝',
    label: 'Posts Created',
    target: 45000,
    suffix: '+',
    key: 'posts'
  },
  {
    icon: '❤️',
    label: 'Engagement Rate',
    target: 94,
    suffix: '%',
    key: 'engagement'
  }
];

const EnhancedStats = () => {
  const [counts, setCounts] = useState({
    images: 0,
    users: 0,
    posts: 0,
    engagement: 0
  });

  useEffect(() => {
    const animateCount = (target, key) => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounts(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, duration / steps);
    };

    // Start animations with slight delays
    stats.forEach((stat, index) => {
      setTimeout(() => animateCount(stat.target, stat.key), index * 200);
    });
  }, []);

  return (
    <section className="py-16 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Growing Every Day</h2>
          <p className="text-gray-300">Join a thriving community of creators</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/60 transition-all duration-300 hover:transform hover:scale-105">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {counts[stat.key].toLocaleString()}{stat.suffix}
                </div>
                <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnhancedStats;