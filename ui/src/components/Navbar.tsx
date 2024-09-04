import React from 'react';
import styles from '../styles/Navbar.module.css';

const Navbar: React.FC = () => {
    return (
      <nav className={styles.navbar}>
        <div className={styles.navbarContent}>
          <div className={styles.navbarBox}>
            <ul className={styles.navItems}>
            <h1>DemocraSafe.</h1>
            <h1>Add a section for social networks</h1>
            </ul>
          </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar; 