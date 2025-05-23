import React from 'react';
import styles from './HeaderComponent.module.css';

const FooterComponent: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; {new Date().getFullYear()} Exam Platform. All rights reserved.</p>
    </footer>
  );
};

export default FooterComponent;
