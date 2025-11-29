import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    image: null,
    tags: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('https://foine-backend.onrender.com/api/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('description', uploadForm.description);
    formData.append('image', uploadForm.image);
    formData.append('tags', uploadForm.tags.split(',').map(tag => tag.trim()));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://foine-backend.onrender.com/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      setShowUpload(false);
      setUploadForm({ title: '', description: '', image: null, tags: '' });
      fetchPosts();
    } catch (err) {
      setError('Upload failed');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="home">
      <header className="header">
        <h1>Foine</h1>
        <div className="header-actions">
          <button onClick={() => setShowUpload(true)} className="upload-btn">Upload</button>
          <button onClick={() => navigate('/profile')} className="profile-btn">Profile</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="posts-grid">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <img src={post.imageUrl} alt={post.title} />
            <div className="post-info">
              <h3>{post.title}</h3>
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

      {showUpload && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Upload Image</h2>
            <form onSubmit={handleUpload}>
              <input
                type="text"
                placeholder="Title"
                value={uploadForm.title}
                onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={uploadForm.description}
                onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadForm({...uploadForm, image: e.target.files[0]})}
                required
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={uploadForm.tags}
                onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
              />
              <div className="modal-actions">
                <button type="submit">Upload</button>
                <button type="button" onClick={() => setShowUpload(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;