import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = JSON.parse(localStorage.getItem('user'));

      if (!token || !userData) {
        navigate('/auth');
        return;
      }

      setUser(userData);

      const response = await fetch(`https://foine-backend.onrender.com/api/posts/user/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch user posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="profile">
      <header className="header">
        <h1>Foine</h1>
        <div className="header-actions">
          <button onClick={() => navigate('/')} className="home-btn">Home</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="profile-content">
        <div className="profile-header">
          <div className="profile-avatar">
            <span>{user?.username?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="profile-info">
            <h2>{user?.username}</h2>
            <p>{user?.email}</p>
            <div className="stats">
              <span>{posts.length} posts</span>
            </div>
          </div>
        </div>

        <div className="posts-section">
          <h3>Your Posts</h3>
          {posts.length === 0 ? (
            <p className="no-posts">No posts yet. <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Create your first post</a></p>
          ) : (
            <div className="posts-grid">
              {posts.map(post => (
                <div key={post.id} className="post-card">
                  <img src={post.imageUrl} alt={post.title} />
                  <div className="post-info">
                    <h4>{post.title}</h4>
                    <p>{post.description}</p>
                    <div className="tags">
                      {post.tags.map(tag => (
                        <span key={tag.id} className="tag">{tag.name}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;