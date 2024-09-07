import Head from 'next/head';
import React, { useState } from 'react';
import { ListGroup, ListGroupItem, Card, CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle, CardText, Button, Modal, ModalHeader, ModalBody, ModalFooter, Accordion, AccordionBody, AccordionHeader, AccordionItem, } from 'reactstrap';
import styles from '../styles/vote.module.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CloseButton } from 'reactstrap';

type Candidate = {
  indexCandidate: any;
  name: string;
  party: string;
};

export default function Vote() {
  // State to track the selected option in the menu
  const [selectedOption, setSelectedOption] = useState(1);
  // State to track the selected candidate
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  // State for the modal
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

  const closeBtn = (
    <button className="close" onClick={toggle} type="button">
      &times;
    </button>
  );

  // Array with candidate details
  const candidates: Candidate[] = [
    { indexCandidate: 1, name: 'Ada Lovelace', party: 'Progressive Future Party (PFP)' },
    { indexCandidate: 2, name: 'Amelia Earhart', party: 'Unity and Freedom Alliance (UFA)' },
  ];

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
    },
    3: {
      title: 'List of candidates',
      content: 'Here are the options for candidates...'
    }
  };

  const handleVoteClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    toggle();
  };

  return (
    <>
      <Head>
        <title>DemocraSafe</title>
        <meta name="description" content="Vote page layout" />
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <div className={styles.pageContainer}>
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
                  <ListGroupItem tag="button" onClick={() => setSelectedOption(3)}>
                    Submit Vote
                  </ListGroupItem>
                </ListGroup>
              </div>

              {/* Section 2 - Dynamic Content */}
              <div className={`${styles.column} ${styles.column2}`}>
                <h2>{sectionContent[selectedOption].title}</h2>
                {selectedOption === 3 ? (
                  // Rendering cards for candidates
                  candidates.map((candidate, index) => (
                    <Card
                      className="my-2"
                      style={{ width: '18rem' }}
                      key={index}
                    >
                      <CardHeader>Candidate {index + 1}</CardHeader>
                      <img
                        alt={`Candidate ${index + 1}`}
                        src={`/assets/candidate${index + 1}.png`}
                        className="customImage"
                      />
                      <CardBody>
                        <CardTitle tag="h5">{candidate.name}</CardTitle>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                          {candidate.party}
                        </CardSubtitle>
                        <CardText></CardText>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button color="success" onClick={() => handleVoteClick(candidate)}>Vote for {candidate.name}</Button>
                        </div>
                      </CardBody>
                      <CardFooter></CardFooter>
                    </Card>
                  ))
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: sectionContent[selectedOption].content }} />
                )}
              </div>
            </div>
            <div className={styles.rightMargin}></div>
          </div>
        </div>
      </div>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader style={{ backgroundColor: '#204a87'}}>
       
            <h5 style={{ color: '#ffffff', margin: 0}}>Confirm Your Vote</h5>

        </ModalHeader>
        <ModalBody>
          {selectedCandidate ?
            (
              <><h5>Are you sure you want to vote for:</h5>

                <Card
                  className="my-2"
                  color="light"
                  inverse
                  style={{
                    width: '18rem',
                    margin: '0 auto'
                  }}
                >
                  <CardHeader>
                    <h1 style={{ color: 'black' }}><strong>{selectedCandidate.name}</strong></h1>
                  </CardHeader>
                  <CardBody>
                    <CardTitle tag="h5">
                      <p style={{ color: 'black' }}><em>{selectedCandidate.party}</em></p>
                    </CardTitle>

                    <img
                      alt={`Image of ${selectedCandidate.name}`}
                      src={`/assets/candidate${selectedCandidate.indexCandidate}.png`}
                      className="customImage"
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        display: 'block',
                        margin: '0 auto'
                      }}
                    />

                  </CardBody>
                </Card></>
            ) : (
              <p>Loading candidate details...</p>
            )}
        </ModalBody>
        <ModalFooter className={styles.modalFooter}>
          <Button color="success" onClick={toggle}>
            Confirm Vote
          </Button>{' '}
          <Button color="danger" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
