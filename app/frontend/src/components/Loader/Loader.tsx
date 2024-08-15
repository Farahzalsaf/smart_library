import React from 'react';
import styles from './Loader.module.css';

const Loader: React.FC = () => {
  return (
    <div className={styles.center}>
      <div className={styles.spinner}>
        <div className={styles.spinnerin}></div>
      </div>
    </div>
  );
};

export default Loader;
