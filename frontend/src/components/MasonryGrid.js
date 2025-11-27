import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FiHeart, FiDownload, FiShare2, FiImage } from 'react-icons/fi';
import PostSkeleton from './PostSkeleton';
import Tag from './Tag';
import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const Card = ({ post, index, onLike, onSave, onShare, onImageClick }) => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${API_BASE}/posts/${post.id}/tags`);
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };

    fetchTags();
  }, [post.id]);
  return (
    <div
      className="relative group mb-6 break-inside-avoid bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 active:scale-95 md:active:scale-100"
    >
      <div className="relative overflow-hidden rounded-2xl">
        {/* Image */}
        <div className="relative">
          <img
            src={post.imageUrl}
            alt={post.title}
            onClick={() => onImageClick(post)}
            className="w-full h-auto object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="w-full">
            {/* Action Buttons */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex space-x-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onLike(post.id); }}
                  className={`p-2 rounded-full backdrop-blur-md border transition-colors ${
                    post.isLiked
                      ? 'bg-red-500/20 border-red-500/50 text-red-400'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <FiHeart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onSave(post.id); }}
                  className={`p-2 rounded-full backdrop-blur-md border transition-colors ${
                    post.isSaved
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <FiDownload className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onShare(post.id); }}
                  className="p-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 backdrop-blur-md transition-colors"
                >
                  <FiShare2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-white text-sm">
                ❤️ {post.likesCount || 0}
              </div>
            </div>

            {/* Post Info */}
            <div className="text-white">
              <p className="text-sm font-medium truncate">{post.title}</p>
              <p className="text-xs opacity-75">
                by{' '}
                <Link
                  to={`/user/${post.userId}`}
                  className="hover:text-purple-400 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {post.user?.username || post.user?.email || 'Unknown'}
                </Link>
              </p>
              <p className="text-xs opacity-50">{new Date(post.createdAt).toLocaleDateString()}</p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.slice(0, 3).map((tag) => (
                    <Tag key={tag.id} tag={tag} size="xs" />
                  ))}
                  {tags.length > 3 && (
                    <span className="text-xs text-gray-400">+{tags.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MasonryGrid = ({ posts, loading, hasMore, fetchMorePosts, onLike, onSave, onShare, onImageClick }) => {
  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="flex -ml-6 w-auto"
          columnClassName="pl-6 bg-clip-padding"
        >
          {Array.from({ length: 8 }, (_, index) => (
            <PostSkeleton key={index} />
          ))}
        </Masonry>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <InfiniteScroll
        dataLength={posts.length}
        next={fetchMorePosts}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        }
        endMessage={
          posts.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">You've seen all posts!</p>
            </div>
          )
        }
      >
        {posts && posts.length > 0 ? (
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="flex -ml-6 w-auto"
            columnClassName="pl-6 bg-clip-padding"
          >
            {posts.map((post, index) => (
              <Card key={post.id} post={post} index={index} onLike={onLike} onSave={onSave} onShare={onShare} onImageClick={onImageClick} />
            ))}
          </Masonry>
        ) : (
          <div className="text-center py-16">
            <FiImage className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No posts yet</h3>
            <p className="text-gray-500">Be the first to share an amazing image!</p>
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
};

export default MasonryGrid;