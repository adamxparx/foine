import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from './Header';
import Hero from './Hero';
import FeatureShowcase from './FeatureShowcase';
import SocialProof from './SocialProof';
import EnhancedStats from './EnhancedStats';
import CTASection from './CTASection';
import Footer from './Footer';
import MasonryGrid from './MasonryGrid';
import Modals from './Modals';
import UploadModal from './UploadModal';
import ImageModal from './ImageModal';
import API_BASE from '../config';

function Home() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [modalState, setModalState] = useState({ isOpen: false, type: 'login' });
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchPosts = useCallback(async (page = 0, append = false) => {
    if (page === 0) {
      setLoading(true);
    }
    try {
      const res = await axios.get(`${API_BASE}/posts`, {
        params: { page, size: 12 }
      });

      // Process posts with like/save status
      let postsWithStatus = res.data.content;
      if (user) {
        postsWithStatus = await Promise.all(
          res.data.content.map(async (post) => {
            try {
              const [likedRes, savedRes, countRes] = await Promise.all([
                axios.get(`${API_BASE}/posts/${post.id}/liked`, { params: { userId: user.id } }),
                axios.get(`${API_BASE}/posts/${post.id}/saved`, { params: { userId: user.id } }),
                axios.get(`${API_BASE}/posts/${post.id}/likes/count`)
              ]);
              return {
                ...post,
                isLiked: likedRes.data,
                isSaved: savedRes.data,
                likesCount: countRes.data
              };
            } catch (err) {
              console.error(`Error fetching status for post ${post.id}:`, err);
              return {
                ...post,
                isLiked: false,
                isSaved: false,
                likesCount: 0
              };
            }
          })
        );
      } else {
        // If no user, set default status
        postsWithStatus = res.data.content.map(post => ({
          ...post,
          isLiked: false,
          isSaved: false,
          likesCount: 0
        }));
      }

      if (append) {
        setPosts(prevPosts => [...prevPosts, ...postsWithStatus]);
      } else {
        setPosts(postsWithStatus);
      }
      setHasMore(!res.data.last);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchQuery('');
      fetchPosts(0, false);
      return;
    }

    setSearchQuery(query);
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/posts/search`, {
        params: { query: query.trim(), page: 0, size: 12 }
      });

      // If user is logged in, fetch liked/saved status for each post
      let postsWithStatus = res.data.content;
      if (user) {
        postsWithStatus = await Promise.all(
          res.data.content.map(async (post) => {
            try {
              const [likedRes, savedRes, countRes] = await Promise.all([
                axios.get(`${API_BASE}/posts/${post.id}/liked`, { params: { userId: user.id } }),
                axios.get(`${API_BASE}/posts/${post.id}/saved`, { params: { userId: user.id } }),
                axios.get(`${API_BASE}/posts/${post.id}/likes/count`)
              ]);
              return {
                ...post,
                isLiked: likedRes.data,
                isSaved: savedRes.data,
                likesCount: countRes.data
              };
            } catch (err) {
              console.error(`Error fetching status for post ${post.id}:`, err);
              return {
                ...post,
                isLiked: false,
                isSaved: false,
                likesCount: 0
              };
            }
          })
        );
      } else {
        // If no user, set default status
        postsWithStatus = res.data.content.map(post => ({
          ...post,
          isLiked: false,
          isSaved: false,
          likesCount: 0
        }));
      }

      setPosts(postsWithStatus);
      setHasMore(!res.data.last);
      setCurrentPage(0);
    } catch (err) {
      console.error("Error searching posts:", err.message);
      // If search fails, fall back to all posts
      fetchPosts(0, false);
    } finally {
      setLoading(false);
    }
  };

  const fetchMorePosts = useCallback(async () => {
    if (hasMore && !loading) {
      const nextPage = currentPage + 1;
      if (searchQuery) {
        // Fetch more search results
        try {
          const res = await axios.get(`${API_BASE}/posts/search`, {
            params: { query: searchQuery, page: nextPage, size: 12 }
          });

          // Process posts with like/save status
          let postsWithStatus = res.data.content;
          if (user) {
            postsWithStatus = await Promise.all(
              res.data.content.map(async (post) => {
                try {
                  const [likedRes, savedRes, countRes] = await Promise.all([
                    axios.get(`${API_BASE}/posts/${post.id}/liked`, { params: { userId: user.id } }),
                    axios.get(`${API_BASE}/posts/${post.id}/saved`, { params: { userId: user.id } }),
                    axios.get(`${API_BASE}/posts/${post.id}/likes/count`)
                  ]);
                  return {
                    ...post,
                    isLiked: likedRes.data,
                    isSaved: savedRes.data,
                    likesCount: countRes.data
                  };
                } catch (err) {
                  console.error(`Error fetching status for post ${post.id}:`, err);
                  return {
                    ...post,
                    isLiked: false,
                    isSaved: false,
                    likesCount: 0
                  };
                }
              })
            );
          } else {
            // If no user, set default status
            postsWithStatus = res.data.content.map(post => ({
              ...post,
              isLiked: false,
              isSaved: false,
              likesCount: 0
            }));
          }

          setPosts(prevPosts => [...prevPosts, ...postsWithStatus]);
          setHasMore(!res.data.last);
          setCurrentPage(nextPage);
        } catch (err) {
          console.error("Error fetching more search results:", err);
        }
      } else {
        // Fetch more regular posts
        fetchPosts(nextPage, true);
      }
    }
  }, [hasMore, loading, currentPage, searchQuery, user, fetchPosts]);

  useEffect(() => {
    // Load user from localStorage first
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUser({ id: parseInt(storedUserId) });
    } else {
      // Force login if no user
      setModalState({ isOpen: true, type: 'login' });
    }
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    // Fetch posts when user state changes
    fetchPosts();
  }, [user, fetchPosts]); // Include fetchPosts to satisfy ESLint

  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE}/login`, { email, password });
      // For simplicity, store user id in localStorage
      localStorage.setItem('userId', res.data.userId);
      setUser({ id: res.data.userId, email: res.data.email });
      setModalState({ isOpen: false, type: 'login' });

      // Refetch posts to get liked/saved status
      fetchPosts();
    } catch (err) {
      alert('Login failed: ' + (err.response?.data || err.message));
    }
  };

  const handleRegister = async (userData) => {
    try {
      await axios.post(`${API_BASE}/register`, userData);
      alert('Registered successfully');
      setModalState({ isOpen: false, type: 'login' });
    } catch (err) {
      let errorMsg = 'Registration failed';
      if (err.response?.data) {
        // Handle both string and object responses
        if (typeof err.response.data === 'string') {
          errorMsg += ': ' + err.response.data;
        } else if (err.response.data.error) {
          errorMsg += ': ' + err.response.data.error;
        } else if (err.response.data.message) {
          errorMsg += ': ' + err.response.data.message;
        }
      } else if (err.response?.status === 400) {
        errorMsg = err.response.data?.error || 'Bad request';
      } else if (err.response?.status === 500) {
        errorMsg = 'Server error - ' + (err.response.data?.error || 'Check backend logs');
      } else if (err.code === 'ECONNABORTED') {
        errorMsg = 'Upload timeout - File too large or slow connection';
      }

      alert(errorMsg);
    }
  };

  const handleUpload = async (formData) => {
    try {
      await axios.post(`${API_BASE}/posts/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 seconds timeout
      });

      alert('Post uploaded successfully!');
      setShowUpload(false);
      // Refresh posts
      fetchPosts();
    } catch (err) {
      let errorMsg = 'Upload failed';
      if (err.response?.data) {
        // Handle both string and object responses
        if (typeof err.response.data === 'string') {
          errorMsg += ': ' + err.response.data;
        } else if (err.response.data.error) {
          errorMsg += ': ' + err.response.data.error;
        } else if (err.response.data.message) {
          errorMsg += ': ' + err.response.data.message;
        }
      } else if (err.response?.status === 400) {
        errorMsg = err.response.data?.error || 'Bad request';
      } else if (err.response?.status === 500) {
        errorMsg = 'Server error - ' + (err.response.data?.error || 'Check backend logs');
      } else if (err.code === 'ECONNABORTED') {
        errorMsg = 'Upload timeout - File too large or slow connection';
      }

      alert(errorMsg);
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      setModalState({ isOpen: true, type: 'login' });
      return;
    }

    try {
      await axios.post(`${API_BASE}/posts/${postId}/like`, { userId: user.id });

      // Update the post's liked status in state
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, isLiked: !post.isLiked }
            : post
        )
      );
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('Failed to toggle like');
    }
  };

  const handleSave = async (postId) => {
    if (!user) {
      setModalState({ isOpen: true, type: 'login' });
      return;
    }

    try {
      await axios.post(`${API_BASE}/posts/${postId}/save`, { userId: user.id });

      // Update the post's saved status in state
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, isSaved: !post.isSaved }
            : post
        )
      );
    } catch (err) {
      console.error('Error toggling save:', err);
      alert('Failed to toggle save');
    }
  };

  const handleShare = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleImageClick = (post) => {
    setSelectedPost(post);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedPost(null);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`${API_BASE}/posts/${postId}`);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      setShowImageModal(false);
      setSelectedPost(null);
      alert('Post deleted successfully');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  const handleGetStarted = () => {
    if (user) {
      // Scroll to grid or something
    } else {
      setModalState({ isOpen: true, type: 'register' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        searchQuery={searchQuery}
        onSearch={handleSearch}
        onUploadClick={() => setShowUpload(true)}
        onLogout={() => {
          setUser(null);
          localStorage.removeItem('userId');
          setSearchQuery('');
          setCurrentPage(0);
          setHasMore(true);
          fetchPosts(0, false); // Reset to all posts on logout
        }}
        onLoginClick={() => setModalState({ isOpen: true, type: 'login' })}
        onRegisterClick={() => setModalState({ isOpen: true, type: 'register' })}
      />

      {!user ? (
        <>
          <Hero onGetStarted={handleGetStarted} />
          <FeatureShowcase />
          <SocialProof />
          <EnhancedStats />
          <CTASection onGetStarted={handleGetStarted} />
          <Footer />
        </>
      ) : (
        <MasonryGrid
          posts={posts}
          loading={loading}
          hasMore={hasMore}
          fetchMorePosts={fetchMorePosts}
          onLike={handleLike}
          onSave={handleSave}
          onShare={handleShare}
          onImageClick={handleImageClick}
        />
      )}

      <Modals
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, type: modalState.type })}
        type={modalState.type}
        onSwitchType={(type) => setModalState({ isOpen: true, type })}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />

      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUpload}
        user={user}
      />

      <ImageModal
        post={selectedPost}
        isOpen={showImageModal}
        onClose={handleCloseImageModal}
        onLike={handleLike}
        onSave={handleSave}
        onDelete={handleDeletePost}
        user={user}
      />
    </div>
  );
}

export default Home;