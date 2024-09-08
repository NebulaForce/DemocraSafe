import Head from 'next/head';
import React from 'react';
import styles from '../../styles/vote.module.css';

export default function CountVotes() {

  return (
    <>
      <Head>
        <title>DemocraSafe</title>
        <meta name="description" content="Count votes page layout" />
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <div className={styles.pageContainer}>
        <h1 className={styles.title}>Count Votes</h1>
      </div>
    </>
  );
}
