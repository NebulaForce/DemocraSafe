import Head from "next/head";
import { useState } from "react";
import styles from '../styles/Home.module.css';

import { ListGroup, ListGroupItem } from 'reactstrap';
import { useRouter } from "next/router";
import { useTransaction } from "@/context/GlobalState";

export default function Home() {

  const router = useRouter();

  // State to track the selected option in the menu
  const [selectedOption, setSelectedOption] = useState(1);

  const sectionContent: { [key: number]: { title: string; content: string } } = {
    1: {
      title: 'What is DemocraSafe?',
      content: `
        <div align="center">
          <img alt="DemocraSafe logo" src="./assets/DemocraSafe_logo.png" width="200" />
          <h1 align="center">DemocraSafe</h1>
          <p align="center">Your vote. Secure. Private. Auditable. Powered by Zero-Knowledge Proofs</p>
        </div>
        <br>
        <div>
          <p style="text-align: justify;">
            Voting on DemocraSafe is designed to be as simple as possible, ensuring anyone can participate with ease. 
            The platform guarantees that your vote remains private while ensuring it is accurately recorded and counted.
          </p>
          <br>
          <p style="text-align: justify;">
            Built on the Mina Protocol, DemocraSafe empowers citizens to cast their votes confidently, knowing that their privacy is protected 
            and the integrity of the election is maintained.
          </p>
        </div>
      `
    },
    2: {
      title: 'How to Vote?',
      content: `
        <div>
          <p style="text-align: justify;">
            DemocraSafe is a cutting-edge voting platform designed to ensure that your vote remains completely private and secure. Born out of a hackathon, it uses advanced cryptography to guarantee that no one—not even the system itself—can see how you voted, while still making sure your vote is counted. With a focus on user privacy and election integrity, DemocraSafe makes it easy to participate in elections of all sizes, from local community votes to national elections, knowing that your vote remains confidential and protected at every step.
          </p>
          <br>
          <p style="text-align: justify;">Follow these instructions:</p>
          <ul>
            <li>1. Check the available candidates</li>
            <li>2. Click on the "Vote" button</li>
            <li>3. Confirm your selection</li>
            <li>4. Sign your election</li>
          </ul>
        </div>
      `
    }
  };

  const { setup, accountDoesNotExist, hasBeenSetup, accountExists } = useTransaction();

  return (
    <>
      <Head>
        <title>DemocraSafe</title>
        <meta name="description" content="The cutting-edge zkApp designed to revolutionize how we vote." />
        <link rel="icon" href="/assets/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
        />
      </Head>
      <>
        <div className={styles.pageContainer}>
          {setup}
          {accountDoesNotExist}
          {
            hasBeenSetup && accountExists && (
              <div className={styles.mainContent}>
                <div className={styles.contentWrapper}>
                  <div className={styles.leftMargin}></div>
                  <div className={styles.columnsContainer}>
                    {/* Section 1 - List of Options */}
                    <div className={`${styles.column} ${styles.column1}`}>
                      <h2>Menu</h2>
                      <ListGroup>
                        <ListGroupItem tag="button" onClick={() => setSelectedOption(1)}>
                          What is DemocraSafe?
                        </ListGroupItem>
                        <ListGroupItem tag="button" onClick={() => setSelectedOption(2)}>
                          How to vote?
                        </ListGroupItem>
                        <ListGroupItem tag="button" onClick={() => { router.push('/candidate/register'); }}>
                          Register Candidate
                        </ListGroupItem>
                        <ListGroupItem tag="button" onClick={() => { router.push('/vote/cast'); }}>
                          Vote
                        </ListGroupItem>
                        <ListGroupItem tag="button" onClick={() => { router.push('/vote/count'); }}>
                          Count Votes
                        </ListGroupItem>
                      </ListGroup>
                    </div>
                    <div className={`${styles.column} ${styles.column2}`}>
                      <h2>{sectionContent[selectedOption].title}</h2>
                      <div dangerouslySetInnerHTML={{ __html: sectionContent[selectedOption].content }} />
                    </div>
                  </div>
                  <div className={styles.rightMargin}></div>
                </div>
              </div>
            )}
        </div>
      </>
    </>
  );
}
