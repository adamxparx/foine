import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import { FiUser, FiCalendar, FiHeart, FiDownload, FiGrid } from 'react-icons/fi';
import API_BASE from '../config';

const UserProfile = ({ currentUser }) => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  const fetchUserProfile = useCallback(async () => {
    try {
      setLoading(true);
      // For now, we'll create a mock user profile since we don't have a user details endpoint
      // In a real app, you'd fetch user details from an API
      const mockUser = {
        id: parseInt(userId),
        username: `user${userId}`,
        email: `user${userId}@example.com`,
        joinDate: new Date().toISOString(),
        postsCount: 0,
        likesCount: 0,
        followersCount: 0
      };
      setUser(mockUser);

      // Fetch user's posts
      const postsRes = await axios.get(`${API_BASE}/posts`);
      const userPosts = postsRes.data.filter(post => post.userId === parseInt(userId));
      setPosts(userPosts);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const masonryBreakpoints = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-24 h-24 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8 mb-8">
              <div className="h-16 bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-700 rounded"></div>
              <div className="h-16 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <FiUser className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">User not found</h2>
          <p className="text-gray-400">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
              <FiUser className="w-12 h-12 text-white" />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{user.username}</h1>
              <p className="text-gray-400 mb-4 flex items-center justify-center md:justify-start">
                <FiCalendar className="w-4 h-4 mr-2" />
                Joined {new Date(user.joinDate).toLocaleDateString()}
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{posts.length}</div>
                  <div className="text-sm text-gray-400">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{user.likesCount || 0}</div>
                  <div className="text-sm text-gray-400">Likes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{user.followersCount || 0}</div>
                  <div className="text-sm text-gray-400">Followers</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center px-6 py-3 font-medium transition-colors ${
              activeTab === 'posts'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FiGrid className="w-4 h-4 mr-2" />
            Posts
          </button>
          <button
            onClick={() => setActiveTab('liked')}
            className={`flex items-center px-6 py-3 font-medium transition-colors ${
              activeTab === 'liked'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FiHeart className="w-4 h-4 mr-2" />
            Liked
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center px-6 py-3 font-medium transition-colors ${
              activeTab === 'saved'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FiDownload className="w-4 h-4 mr-2" />
            Saved
          </button>
        </div>

        {/* Content */}
        {activeTab === 'posts' && (
          <div>
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
                  </div>
                ))}
              </Masonry>
            ) : (
              <div className="text-center py-16">
                <FiGrid className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No posts yet</h3>
                <p className="text-gray-500">This user hasn't shared any images.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'liked' && (
          <div className="text-center py-16">
            <FiHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Liked posts</h3>
            <p className="text-gray-500">Liked posts will be shown here.</p>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="text-center py-16">
            <FiDownload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Saved posts</h3>
            <p className="text-gray-500">Saved posts will be shown here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;