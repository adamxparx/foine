import React from 'react';
import { motion } from 'framer-motion';

const SocialProof = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Digital Artist',
      avatar: '🎨',
      content: 'Foine has transformed how I share my artwork. The community is incredibly supportive and I\'ve discovered so many amazing creators.',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Photographer',
      avatar: '📸',
      content: 'The best platform for visual inspiration. Clean interface, amazing features, and a community that truly appreciates creativity.',
      rating: 5
    },
    {
      name: 'Emma Thompson',
      role: 'Graphic Designer',
      avatar: '💻',
      content: 'I\'ve found countless design inspirations here. The save feature helps me organize everything perfectly for my projects.',
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-600'}>
        ★
      </span>
    ));
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Loved by{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Creative Minds
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of creators who trust Foine to showcase their work and discover inspiration.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xl mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>

              <p className="text-gray-300 leading-relaxed">"{testimonial.content}"</p>
            </motion.div>
          ))}
        </div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🔒</span>
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">⚡</span>
              <span>Fast Uploads</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">🌟</span>
              <span>High Quality</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">🤝</span>
              <span>Community Driven</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProof;