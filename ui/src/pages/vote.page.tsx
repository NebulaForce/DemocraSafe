import Head from 'next/head';
import React from 'react';
import styles from '../styles/vote.module.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Vote() {
  return (
    <>
      <Head>
        <title>DemocraSafe.</title>
        <meta name="description" content="Vote page layout" />
      </Head>
      <Navbar />
      <div className={styles.mainContent}>
        <div className={styles.columnsContainer}>
          <div className={`${styles.column} ${styles.column1}`}>
            <h2>Section 1</h2>
            <p>A page that allows the user to navigate thru the sections. Like, section to know about what is DemocraSafe. and another section to explain how to Vote and another to show results</p>
          </div>
          <div className={`${styles.column} ${styles.column2}`}>
            <h2>Section 2</h2>
            <p>The content of the section select by the user</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
