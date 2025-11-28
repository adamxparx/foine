import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiDownload, FiX, FiUser, FiCalendar, FiTrash2, FiMessageCircle, FiSend } from 'react-icons/fi';
import axios from 'axios';
import Tag from './Tag';
import API_BASE from '../config';

const ImageModal = ({ post, isOpen, onClose, onLike, onSave, onDelete, user }) => {
  const [isLiked, setIsLiked] = useState(post?.isLiked || false);
  const [isSaved, setIsSaved] = useState(post?.isSaved || false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [tags, setTags] = useState([]);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const fetchTags = useCallback(async () => {
    if (!post) return;
    try {
      const res = await axios.get(`${API_BASE}/posts/${post.id}/tags`);
      setTags(res.data);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  }, [post]);

  useEffect(() => {
    if (post) {
      setIsLiked(post.isLiked || false);
      setIsSaved(post.isSaved || false);
      fetchTags();
    }
  }, [post, fetchTags]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const fetchComments = useCallback(async () => {
    if (!post) return;
    setLoadingComments(true);
    try {
      const res = await axios.get(`${API_BASE}/posts/${post.id}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  }, [post]);

  // Touch handlers for mobile swipe-to-close
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isDownSwipe = distance > minSwipeDistance;
    if (isDownSwipe) {
      onClose();
    }
  };

  // Fetch comments when modal opens
  useEffect(() => {
    if (isOpen && post) {
      fetchComments();
    }
  }, [isOpen, post, fetchComments]);

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      const res = await axios.post(`${API_BASE}/posts/${post.id}/comment`, null, {
        params: {
          userId: user.id,
          comment: newComment.trim()
        }
      });
      setComments(prev => [...prev, res.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleCommentKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  if (!isOpen || !post) return null;

  const handleLike = async () => {
    try {
      await onLike(post.id);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Like failed:', error);
    }
  };

  const handleSave = async () => {
    try {
      await onSave(post.id);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await onDelete(post.id);
        onClose();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
    setShowDeleteConfirm(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Modal */}
        <div
          className="bg-gray-900 rounded-2xl overflow-hidden max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Section */}
          <div className="w-full md:w-7/10 bg-black flex items-center justify-center relative min-h-[50vh] md:min-h-0">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="max-w-full max-h-full object-contain"
            />

            {/* Close button overlay */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Details Section */}
          <div className="w-full md:w-3/10 bg-gray-800 p-4 md:p-6 flex flex-col max-h-[40vh] md:max-h-none overflow-y-auto">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{post.description}</p>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag) => (
                    <Tag key={tag.id} tag={tag} size="sm" />
                  ))}
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                <FiUser className="w-5 h-5 text-white" />
              </div>
              <div>
                <Link
                  to={`/user/${post.userId}`}
                  className="text-white font-medium hover:text-purple-400 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {post.user?.username || 'Anonymous'}
                </Link>
                <p className="text-gray-400 text-sm flex items-center">
                  <FiCalendar className="w-3 h-3 mr-1" />
                  {post.date || 'Recently'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mb-6">
              <button
                onClick={handleLike}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  isLiked
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{isLiked ? 'Liked' : 'Like'}</span>
              </button>

              <button
                onClick={handleSave}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  isSaved
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <FiDownload className="w-5 h-5" />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              {user && post.userId === user.id && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  title="Delete post"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="mb-6 pt-6 border-t border-gray-700">
              <div className="flex justify-between text-sm text-gray-400">
                <span>{post.likesCount || 0} likes</span>
                <span>{comments.length} comments</span>
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <FiMessageCircle className="w-4 h-4 mr-2" />
                Comments
              </h3>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                {loadingComments ? (
                  <div className="text-gray-400 text-sm">Loading comments...</div>
                ) : comments.length === 0 ? (
                  <div className="text-gray-400 text-sm">No comments yet. Be the first to comment!</div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-2">
                          <FiUser className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-white text-sm font-medium">
                          {comment.user?.username || 'Anonymous'}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{comment.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              {user ? (
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex space-x-2">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={handleCommentKeyPress}
                      placeholder="Add a comment..."
                      className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      rows="2"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSend className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-gray-400 text-sm text-center">
                    Please log in to comment
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold mb-4">Delete Post</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageModal;