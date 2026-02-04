
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Service from './pages/Service';
import Pricing from './pages/Pricing';
import Cases from './pages/Cases';
import Trends from './pages/Trends';
import Blog from './pages/Blog';
import About from './pages/About';
import Support from './pages/Support';
import Signup from './pages/Signup';
import SearchResults from './pages/SearchResults';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/service" element={<Service />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/support" element={<Support />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
