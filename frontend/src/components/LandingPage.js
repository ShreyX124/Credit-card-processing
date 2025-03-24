// frontend/src/components/LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import '../styles/GlobalStyles.css';
import '../styles/TextStyles.css';
import '../styles/ButtonStyles.css';
import '../styles/LandingPageStyles.css';

const LandingPage = () => {
  // Mouse position for 3D tilt effect on the card
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  return (
    <div className="landing-container">
      {/* Background Elements */}
      <div className="donut top-left"></div>
      <div className="earth bottom-right"></div>
      <div className="floating-particles">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`particle particle-${i}`}></div>
        ))}
      </div>

      {/* Hero Section */}
      <motion.div
        className="hero-section"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="hero-title">Welcome to Credit Card Processing</h1>
        <p className="hero-subtitle">Securely process payments with ease.</p>

        {/* 3D Credit Card */}
        <motion.div
          className="credit-card"
          style={{ rotateX, rotateY, perspective: 1000 }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            x.set(e.clientX - rect.left - centerX);
            y.set(e.clientY - rect.top - centerY);
          }}
          onMouseLeave={() => {
            x.set(0);
            y.set(0);
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div className="card-content">
            <div className="card-chip"></div>
            <div className="card-number">1234 5678 9012 3456</div>
            <div className="card-details">
              <div className="card-holder">John Doe</div>
              <div className="card-expiry">12/25</div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action Button */}
        <div className="cta-buttons">
          <Link to="/login">
            <motion.button
              className="btn btn-primary"
              whileHover={{ scale: 1.1, boxShadow: '0px 0px 15px rgba(255, 107, 107, 0.5)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Start
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Wave Animation at the Bottom */}
      <div className="wave">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="#ff6b6b"
            fillOpacity="0.3"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,213.3C960,203,1056,181,1152,181.3C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2025 Credit Card Processing. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;