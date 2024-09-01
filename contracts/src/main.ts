import { Votes } from './HandleVotes.js';
import {
  Field,
  Mina,
  PrivateKey,
  AccountUpdate,
  Poseidon,
  MerkleMap,
} from 'o1js';
console.log('Start Game');

// Constants
const useProof = false;

// Initialize Mina blockchain instance
const Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
Mina.setActiveInstance(Local);
const { privateKey: deployerKey, publicKey: deployerAccount } = Local.testAccounts[0];
const { privateKey: senderKey, publicKey: senderAccount } = Local.testAccounts[1];

// Generate zkApp keys
const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

// Create zkApp instance
const zkAppInstance = new Votes(zkAppAddress);

// Initialize Merkle Maps for voters and candidates
const voters = new MerkleMap();
const candidates = new MerkleMap();

/**
 * Deploys the zkApp and initializes the state.
 */
async function deployZkApp() {
  const deployTransaction = await Mina.transaction(deployerAccount, () => {
    AccountUpdate.fundNewAccount(deployerAccount);
    zkAppInstance.deploy();
    zkAppInstance.initState(candidates.getRoot(), voters.getRoot());
  });
  await deployTransaction.prove();
  await deployTransaction.sign([deployerKey, zkAppPrivateKey]).send();
}

/**
 * Creates a voter and candidate, then performs a voting transaction.
 */
async function performVote() {
  const voter = PrivateKey.random();
  const voterPublic = voter.toPublicKey();
  const vkey = Field(Poseidon.hash(voterPublic.toFields()));
  const voterWitness = voters.getWitness(vkey);

  const candidate = PrivateKey.random();
  const candidatePublic = candidate.toPublicKey();
  const ckey = Field(Poseidon.hash(candidatePublic.toFields()));
  const candidateWitness = candidates.getWitness(ckey);

  // First voting transaction
  const transaction1 = await Mina.transaction(senderAccount, () => {
    zkAppInstance.vote(voterWitness, candidateWitness, Field(0), voterPublic, candidatePublic);
  });
  await transaction1.prove();
  await transaction1.sign([senderKey]).send();

  console.log('After transaction1: Vote recorded');

  // Update Merkle maps
  voters.set(vkey, Field(1));
  const candidateVoteCount = candidates.get(ckey);
  candidates.set(ckey, candidateVoteCount.add(Field(1)));

  // Attempt a second vote by the same voter
  try {
    const transaction2 = await Mina.transaction(senderAccount, () => {
      zkAppInstance.vote(voterWitness, candidateWitness, Field(1), voterPublic, candidatePublic);
    });
    await transaction2.prove();
    await transaction2.sign([senderKey]).send();
  } catch (ex: any) {
    console.error('Vote failed:', ex.message);
  }
  console.log('After transaction2: Attempted double voting');
}

/**
 * Main function to deploy and perform voting.
 */
async function main() {
  await deployZkApp();
  await performVote();
  console.log('Shutting down');
}

await main();
