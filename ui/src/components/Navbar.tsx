import React from 'react';
import styles from '../styles/Navbar.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContent}>
        <div className={styles.leftSection}>
          <img src="/assets/democrasafe_logo.png" alt="DemocraSafe Logo" className={styles.logo} />
          <h1 className={styles.logoText}>DemocraSafe.</h1>
        </div>
        <div className={styles.rightSection}>
          <ul className={styles.socialIcons}>
            <li>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
