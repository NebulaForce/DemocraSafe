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
 * Creates a new candidate inside a Mina transaction, adds them to the MerkleMap, and initializes their vote count.
 * @returns {Object} An object containing the candidate's private and public keys.
 */
async function createCandidate(candidatePrivateKey:PrivateKey) {

  const candidatePublicKey = candidatePrivateKey.toPublicKey();

  const ckey = Field(Poseidon.hash(candidatePublicKey.toFields()));

  // Create a transaction to add the candidate to the zkApp state
  const transaction = await Mina.transaction(senderAccount, () => {
    candidates.set(ckey, Field(0));
    zkAppInstance.candidates.set(candidates.getRoot());
  });

  await transaction.prove();
  await transaction.sign([senderKey]).send();

  console.log('New Candidate Created and Added to State:', candidatePublicKey.toBase58());
  return { candidatePrivateKey, candidatePublicKey };
}

/**
 * Creates a voter and candidate using the provided keys, then performs a voting transaction.
 * @param voterPrivateKey The private key of the voter.
 * @param candidatePrivateKey The private key of the candidate.
 */
async function performVote(voterPrivateKey: PrivateKey, candidatePrivateKey: PrivateKey) {
  const voterPublic = voterPrivateKey.toPublicKey();
  const vkey = Field(Poseidon.hash(voterPublic.toFields()));
  const voterWitness = voters.getWitness(vkey);

  const candidatePublic = candidatePrivateKey.toPublicKey();
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


}

/**
 * Main function to deploy and perform voting.
 */
async function main() {
  await deployZkApp();
  const candidatePrivateKeyRandom = PrivateKey.random();
  // Create a new candidate within a transaction
  const { candidatePrivateKey } = await createCandidate(candidatePrivateKeyRandom);

  // Define custom voter private key
  const voterPrivateKey = PrivateKey.random();

  // Perform the voting process with the created candidate and the provided voter
  await performVote(voterPrivateKey, candidatePrivateKey);

  console.log("---End Game---");
}

await main();
