import Head from 'next/head';
import React from 'react';
import { Table, Progress } from 'reactstrap';
import styles from '../../styles/results.module.css';

type Candidate = {
    indexCandidate: any;
    name: string;
    party: string;
    qVotes: any;
};

export default function Vote() {

    // Array with candidate details
    const candidates: Candidate[] = [
        { qVotes: 2, indexCandidate: 1, name: 'Ada Lovelace', party: 'Progressive Future Party (PFP)' },
        { qVotes: 4, indexCandidate: 2, name: 'Amelia Earhart', party: 'Unity and Freedom Alliance (UFA)' },
    ];

    // Calculate total votes
    const totalVotes = candidates.reduce((acc, candidate) => acc + candidate.qVotes, 0);

    // Calculate percentages
    const candidatesWithPercentage = candidates.map(candidate => ({
        ...candidate,
        percentage: totalVotes > 0 ? (candidate.qVotes / totalVotes) * 100 : 0,
    }));

    // Find the maximum percentage
    const maxPercentage = Math.max(...candidatesWithPercentage.map(candidate => candidate.percentage));

    return (
        <>
            <Head>
                <title>Live Election Results</title>
                <meta name="description" content="Live results of the election" />
                <link rel="icon" href="/assets/favicon.ico" />
            </Head>

            {/* Page container */}
            <div className={styles.pageContainer}>

                {/* Title with lines */}
                <div className={styles.titleContainer}>
                    <hr className={styles.grayLine} />
                    <h1 className={styles.title}>Live Results</h1>
                    <hr className={styles.grayLine} />
                </div>

                {/* Intro text */}
                <div className={styles.introText}>
                    <p>Stay tuned for the latest updates on the election results! Below, you’ll find the current vote count and percentage for each candidate. The results will be updated in real-time as more votes are counted.</p>
                </div>

                {/* Candidate table container */}
                <div className={styles.tableContainer}>
                    <Table className="my-2">
                        <thead className="table-light">
                            <tr>
                                <th>Candidate</th>
                                <th>Results</th>
                                <th>Progress</th>
                            </tr>
                        </thead>
                        <tbody>
                            {candidatesWithPercentage.map(candidate => (
                                <tr key={candidate.indexCandidate}>
                                    <th scope="row">
                                        <h5>{candidate.name}</h5>
                                        <img
                                            alt={`Candidate ${candidate.indexCandidate}`}
                                            src={`/assets/candidate${candidate.indexCandidate}.png`}
                                            className={styles.customImage} 
                                        />
                                    </th>
                                    <td className={styles.tableContentCenter}>
                                        <div className={styles.introText}>
                                            <h6>{candidate.party}</h6>
                                            <h4>{candidate.qVotes} votes</h4>
                                        </div>
                                    </td>
                                    <td>
                                        <Progress
                                            className={`my-2 ${styles.customProgressBar} ${candidate.percentage === maxPercentage ? styles.winnerProgress : ''}`}
                                            value={candidate.percentage}
                                        >
                                            {candidate.percentage.toFixed(2)}%
                                        </Progress>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                {/* Note */}
                <div className={styles.introText}>
                    <p>The percentage is calculated based on the total number of votes cast.</p>
                </div>
            </div>
        </>
    );
}
