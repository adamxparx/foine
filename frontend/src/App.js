import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import TagPage from './components/TagPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/tag/:tagName" element={<TagPage />} />
      </Routes>
    </Router>
  );
}

export default App;
