import Head from 'next/head';
import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, CardTitle, CardSubtitle, CardText, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styles from '../../styles/vote.module.css';

type Candidate = {
  indexCandidate: any;
  name: string;
  party: string;
};

export default function Vote() {
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

  const handleVoteClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    toggle();
  };

  return (
    <>
      <Head>
        <title>Vote</title>
        <meta name="description" content="Vote page layout" />
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      
      {/* Page container */}
      <div className={styles.pageContainer}>
        
        {/* Title with lines */}
        <div className={styles.titleContainer}>
          <hr className={styles.grayLine} />
          <h1 className={styles.title}>Cast Your Vote</h1>
          <hr className={styles.grayLine} />
        </div>
        
        {/* introText */}
        <div className={styles.introText}>
          <p>Welcome to the voting page! Here, you can choose your preferred candidate from the list below. Review the candidates' information and click on the "Vote for [Candidate Name]" button to cast your vote. Your vote is important and will help shape the future. Make sure to select the candidate who aligns best with your values and vision for the future.</p>
        </div>

        {/* Candidate cards */}
        <div className={styles.candidatesContainer}>
          {
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
          }
        </div>
      </div>

      {/* Modal for vote confirmation */}
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader style={{ backgroundColor: '#204a87' }}>
          <h5 style={{ color: '#ffffff', margin: 0 }}>Confirm Your Vote</h5>
        </ModalHeader>
        <ModalBody>
          {selectedCandidate ?
            (
              <>
                <h5>Are you sure you want to vote for:</h5>

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
                </Card>
              </>
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
