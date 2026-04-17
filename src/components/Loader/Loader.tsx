import React from 'react';
import styles from './Loader.module.css';

const Loader: React.FC = () => (
  <div className={styles.loaderWrap}>
    <div className={styles.spinner} />
    <p className={styles.text}>Loading data...</p>
  </div>
);

export default Loader;
