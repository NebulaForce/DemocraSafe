import Head from 'next/head';
import Image from 'next/image';
import { useEffect } from 'react';
import GradientBG from '../components/GradientBG.js';
import styles from '../styles/Home.module.css';
import heroMinaLogo from '../../public/assets/hero-mina-logo.svg';
import arrowRightSmall from '../../public/assets/arrow-right-small.svg';
import { AccountUpdate, Field, MerkleMap, Poseidon, PrivateKey } from 'o1js';

export default function Home() {
  useEffect(() => {
    (async () => {
      const { Mina } = await import('o1js');
      const { Votes } = await import('../../../contracts/build/src/');
      try {
        const Local = Mina.LocalBlockchain({ proofsEnabled: false });
        Mina.setActiveInstance(Local);
        const { privateKey: deployerKey, publicKey: deployerAccount } = Local.testAccounts[0];
        const { privateKey: senderKey, publicKey: senderAccount } = Local.testAccounts[1];

        // Generate keys for zkApp
        const zkAppPrivateKey = PrivateKey.random();
        const zkAppAddress = zkAppPrivateKey.toPublicKey();
        const zkAppInstance = new Votes(zkAppAddress);

        // Initialize Merkle Maps for voters and candidates
        const voters = new MerkleMap();
        const candidates = new MerkleMap();

        // Deploy the zkApp
        const deployTransaction = await Mina.transaction(deployerAccount, () => {
          AccountUpdate.fundNewAccount(deployerAccount);
          zkAppInstance.deploy();
          zkAppInstance.initState(candidates.getRoot(), voters.getRoot());
        });
        await deployTransaction.prove();
        await deployTransaction.sign([deployerKey, zkAppPrivateKey]).send();

        console.log('zkApp deployed and initialized');

        // Create a new candidate
        const candidatePrivateKey = PrivateKey.random();
        const candidatePublicKey = candidatePrivateKey.toPublicKey();
        const ckey = Field(Poseidon.hash(candidatePublicKey.toFields()));

        const createCandidateTransaction = await Mina.transaction(senderAccount, () => {
          candidates.set(ckey, Field(0));
          zkAppInstance.candidates.set(candidates.getRoot());
        });
        await createCandidateTransaction.prove();
        await createCandidateTransaction.sign([senderKey]).send();

        console.log('Candidate created and added to state');

        // Cast a vote
        const voterPrivateKey = PrivateKey.random();
        const voterPublicKey = voterPrivateKey.toPublicKey();
        const vkey = Field(Poseidon.hash(voterPublicKey.toFields()));
        const candidateWitness = candidates.getWitness(ckey);
        const voterWitness = voters.getWitness(vkey);

        const voteTransaction = await Mina.transaction(senderAccount, () => {
          zkAppInstance.vote(voterWitness, candidateWitness, Field(0), voterPublicKey, candidatePublicKey);
        });
        await voteTransaction.prove();
        await voteTransaction.sign([senderKey]).send();

        console.log('Vote recorded successfully');
      } catch (error) {
        console.error('Error interacting with zkApp:', error);
        console.log('An error occurred');
      }
    })();
  }, []);

  return (
    <>
      <Head>
        <title>Mina zkApp UI</title>
        <meta name="description" content="built with o1js" />
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
      <GradientBG>
        <main className={styles.main}>
          <div className={styles.center}>
            <a
              href="https://minaprotocol.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className={styles.logo}
                src={heroMinaLogo}
                alt="Mina Logo"
                width="191"
                height="174"
                priority
              />
            </a>
            <p className={styles.tagline}>
              built with
              <code className={styles.code}> o1js</code>
            </p>
          </div>
          <p className={styles.start}>
            Get started by editing
            <code className={styles.code}> src/pages/index.js</code> or <code className={styles.code}> src/pages/index.tsx</code>
          </p>
          <div className={styles.grid}>
            <a
              href="https://docs.minaprotocol.com/zkapps"
              className={styles.card}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>
                <span>DOCS</span>
                <div>
                  <Image
                    src={arrowRightSmall}
                    alt="Arrow pointing right"
                    width={16}
                    height={16}
                    priority
                  />
                </div>
              </h2>
              <p>Explore zkApps, how to build one, and in-depth references</p>
            </a>
            <a
              href="https://docs.minaprotocol.com/zkapps/tutorials/hello-world"
              className={styles.card}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>
                <span>TUTORIALS</span>
                <div>
                  <Image
                    src={arrowRightSmall}
                    alt="Arrow pointing right"
                    width={16}
                    height={16}
                    priority
                  />
                </div>
              </h2>
              <p>Learn with step-by-step o1js tutorials</p>
            </a>
            <a
              href="https://discord.gg/minaprotocol"
              className={styles.card}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>
                <span>QUESTIONS</span>
                <div>
                  <Image
                    src={arrowRightSmall}
                    alt="Arrow pointing right"
                    width={16}
                    height={16}
                    priority
                  />
                </div>
              </h2>
              <p>Ask questions on our Discord server</p>
            </a>
            <a
              href="https://docs.minaprotocol.com/zkapps/how-to-deploy-a-zkapp"
              className={styles.card}
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2>
                <span>DEPLOY</span>
                <div>
                  <Image
                    src={arrowRightSmall}
                    alt="Arrow pointing right"
                    width={16}
                    height={16}
                    priority
                  />
                </div>
              </h2>
              <p>Deploy a zkApp to Testnet</p>
            </a>
          </div>
        </main>
      </GradientBG>
    </>
  );
}
