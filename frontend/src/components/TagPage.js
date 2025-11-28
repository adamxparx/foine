import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { FiTag, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import API_BASE from '../config';

const TagPage = () => {
  const { tagName } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPostsByTag = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE}/posts/tag/${decodeURIComponent(tagName)}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts by tag:', error);
      setError('Failed to load posts for this tag');
    } finally {
      setLoading(false);
    }
  }, [tagName]);

  useEffect(() => {
    fetchPostsByTag();
  }, [tagName, fetchPostsByTag]);

  const masonryBreakpoints = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-8 h-8 bg-gray-700 rounded"></div>
              <div className="h-8 bg-gray-700 rounded w-48"></div>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="aspect-square bg-gray-700 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <FiTag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error loading tag</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/"
            className="p-2 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-3">
            <FiTag className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">#{decodeURIComponent(tagName)}</h1>
            <span className="text-gray-400">({posts.length} posts)</span>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <Masonry
            breakpointCols={masonryBreakpoints}
            className="flex -ml-6 w-auto"
            columnClassName="pl-6 bg-clip-padding"
          >
            {posts.map((post) => (
              <div
                key={post.id}
                className="mb-6 break-inside-avoid bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                onClick={() => {/* Handle post click */}}
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-medium truncate">{post.title}</h3>
                  <p className="text-gray-400 text-sm truncate">{post.description}</p>
                </div>
              </div>
            ))}
          </Masonry>
        ) : (
          <div className="text-center py-16">
            <FiTag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No posts found</h3>
            <p className="text-gray-500 mb-6">There are no posts with this tag yet.</p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Browse All Posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TagPage;