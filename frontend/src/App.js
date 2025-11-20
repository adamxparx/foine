import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import './App.css';

const API_BASE = 'http://localhost:8080/api';

function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchPosts();
    // Load user from localStorage
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      // For simplicity, assume email is stored or fetch user
      // Since we don't have email, perhaps just set id
      setUser({ id: parseInt(storedUserId) });
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE}/login`, { email, password });
      // For simplicity, store user id in localStorage
      localStorage.setItem('userId', res.data.userId);
      setUser({ id: res.data.userId, email: res.data.email });
      setShowLogin(false);
    } catch (err) {
      alert('Login failed: ' + (err.response?.data || err.message));
    }
  };

  const handleRegister = async (email, password, username) => {
    try {
      await axios.post(`${API_BASE}/register`, { email, password, username });
      alert('Registered successfully');
      setShowRegister(false);
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data || err.message));
    }
  };

  const handleUpload = async (title, description, image) => {
    if (!user) {
      alert('Please login first');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('userId', user.id);

    try {
      console.log("Starting upload...");
      const res = await axios.post(`${API_BASE}/posts/upload`, formData);
      console.log("Upload response:", res.data);
      
      // Refetch all posts to ensure state is updated
      await fetchPosts();
      
      alert('Image uploaded successfully!');
      setShowUpload(false);
    } catch (err) {
      console.error("Upload error:", err);
      alert('Upload failed: ' + (err.response?.data?.error || err.response?.data || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Foine - Pinterest Clone</h1>
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <button onClick={() => setShowUpload(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
              <span>Welcome, {user.email}</span>
              <button onClick={() => { setUser(null); localStorage.removeItem('userId'); }} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
            </div>
          ) : (
            <div>
              <button onClick={() => setShowLogin(true)} className="mr-2 bg-green-500 text-white px-4 py-2 rounded">Login</button>
              <button onClick={() => setShowRegister(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
            </div>
          )}
        </div>
      </header>

      {(() => {
        const breakpointColumnsObj = {
          "default": 3,
          1100: 2,
          700: 1
        };
        return (
          <main className="p-4">
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
          {posts.map(post => {
            if (!post.imageUrl) return null;
            const isVideo = post.imageUrl.match(/\.(mp4|avi|mov|wmv|flv|webm|mkv)$/i);
            return (
              <div key={post.id} className="mb-4 bg-white rounded shadow">
                {isVideo ? (
                  <video controls src={`http://localhost:8080${post.imageUrl}`} className="w-full rounded-t" />
                ) : (
                  <img src={`http://localhost:8080${post.imageUrl}`} alt={post.title} className="w-full rounded-t" />
                )}
                <div className="p-4">
                  <h3 className="font-bold">{post.title}</h3>
                  <p>{post.description}</p>
                </div>
              </div>
            );
          })}
        </Masonry>
      </main>
        );
      })()}

      {showLogin && <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onRegister={handleRegister} onClose={() => setShowRegister(false)} />}
      {showUpload && <UploadModal onUpload={handleUpload} onClose={() => setShowUpload(false)} />}
    </div>
  );
}

function LoginModal({ onLogin, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded">
        <h2 className="text-xl mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full mb-2 p-2 border" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full mb-2 p-2 border" required />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Login</button>
          <button onClick={onClose} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        </form>
      </div>
    </div>
  );
}

function RegisterModal({ onRegister, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(email, password, username);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded">
        <h2 className="text-xl mb-4">Register</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full mb-2 p-2 border" required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full mb-2 p-2 border" required />
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="block w-full mb-2 p-2 border" required />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
          <button onClick={onClose} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        </form>
      </div>
    </div>
  );
}

function UploadModal({ onUpload, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload(title, description, image);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded">
        <h2 className="text-xl mb-4">Upload Post</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="block w-full mb-2 p-2 border" required />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="block w-full mb-2 p-2 border" required />
          <input type="file" accept="image/*,video/*" onChange={(e) => setImage(e.target.files[0])} className="block w-full mb-2" required />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Upload</button>
          <button onClick={onClose} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default App;
