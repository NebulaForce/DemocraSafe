import {
  Mina,
  AccountUpdate,
  Field,
  MerkleMap,
  Poseidon,
  PrivateKey,
  PublicKey,
} from "o1js";
import { Votes } from "../../../../contracts/build/src/HandleVotes";

class ZkAppService {
  zkAppInstance: Votes;
  candidates = new MerkleMap();
  voters = new MerkleMap();
  senderKey: PrivateKey;
  senderAccount: PublicKey;
  candidateNames = new Map(); // Map to store candidate names
  candidateKeys = new Map(); // Map to store candidate public keys
  candidateVotes = new Map(); // Map to store candidate votes

  async initialize() {
    const { Votes } = await import("../../../../contracts/build/src");
    const Local = Mina.LocalBlockchain({ proofsEnabled: false });
    Mina.setActiveInstance(Local);
    const { privateKey: deployerKey, publicKey: deployerAccount } =
      Local.testAccounts[0];
    const { privateKey: senderKey, publicKey: senderAccount } =
      Local.testAccounts[1];

    // Generate keys for zkApp
    const zkAppPrivateKey = PrivateKey.random();
    const zkAppAddress = zkAppPrivateKey.toPublicKey();
    this.zkAppInstance = new Votes(zkAppAddress);

    // Initialize Merkle Maps for voters and candidates
    this.voters = new MerkleMap();
    this.candidates = new MerkleMap();

    // Deploy the zkApp
    const deployTransaction = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      this.zkAppInstance.deploy();
      this.zkAppInstance.initState(
        this.candidates.getRoot(),
        this.voters.getRoot()
      );
    });
    await deployTransaction.prove();
    await deployTransaction.sign([deployerKey, zkAppPrivateKey]).send();

    console.log("zkApp deployed and initialized");

    this.senderKey = senderKey;
    this.senderAccount = senderAccount;
  }

  async createCandidate(candidatePublicKey: PublicKey, candidateName: string) {
    if (
      !this.zkAppInstance ||
      !this.candidates ||
      !this.senderKey ||
      !this.senderAccount
    ) {
      throw new Error("Service not initialized");
    }

    const ckey = Field(Poseidon.hash(candidatePublicKey.toFields()));
    this.candidateNames.set(ckey.toString(), candidateName); // Save candidate name
    this.candidateKeys.set(candidateName, candidatePublicKey); // Save candidate public key
    this.candidateVotes.set(ckey.toString(), Field(0)); // Initialize candidate votes

    const createCandidateTransaction = await Mina.transaction(
      this.senderAccount,
      () => {
        this.candidates.set(ckey, Field(0));
        this.zkAppInstance.candidates.set(this.candidates.getRoot());
      }
    );
    await createCandidateTransaction.prove();
    await createCandidateTransaction.sign([this.senderKey]).send();

    console.log("Candidate created and added to state");
    return ckey;
  }

  async castVote(voterPublicKey: PublicKey, candidatePublicKey: PublicKey) {
    if (
      !this.zkAppInstance ||
      !this.candidates ||
      !this.voters ||
      !this.senderKey ||
      !this.senderAccount
    ) {
      throw new Error("Service not initialized");
    }

    const vkey = Field(Poseidon.hash(voterPublicKey.toFields()));
    const ckey = Field(Poseidon.hash(candidatePublicKey.toFields()));
    const candidateWitness = this.candidates.getWitness(ckey);
    const voterWitness = this.voters.getWitness(vkey);

    const voteTransaction = await Mina.transaction(this.senderAccount, () => {
      this.zkAppInstance.vote(
        voterWitness,
        candidateWitness,
        Field(0),
        voterPublicKey,
        candidatePublicKey
      );
    });
    await voteTransaction.prove();
    await voteTransaction.sign([this.senderKey]).send();

    // Update candidate votes locally
    let currentVotes = this.candidateVotes.get(ckey.toString()) || Field(0);
    this.candidateVotes.set(ckey.toString(), currentVotes.add(Field(1)));

    console.log("Vote recorded successfully");
  }

  getWinner() {
    if (!this.candidates || !this.zkAppInstance) {
      throw new Error("Service not initialized");
    }

    // Determine the candidate with the highest number of votes
    let maxVotes = Field(0);
    let winnerKey = null;

    for (const [ckeyStr, votes] of this.candidateVotes) {
      const votesField = Field(votes);
      if (votesField.toBigInt() > maxVotes.toBigInt()) {
        maxVotes = votesField;
        winnerKey = ckeyStr;
      }
    }

    if (winnerKey) {
      const winnerName = this.candidateNames.get(winnerKey);
      console.log("Winner:", winnerName, "with votes:", maxVotes.toString());
      return {
        name: winnerName,
        votes: maxVotes.toString(),
        publicKey: this.candidateKeys.get(winnerName),
      };
    } else {
      console.log("No candidates found");
      return null;
    }
  }

  getAllCandidates() {
    const allCandidates = [];
    for (const [ckeyStr, name] of this.candidateNames) {
      const ckey = Field(ckeyStr);
      const candidatePublicKey = this.candidateKeys.get(name);
      if (name && candidatePublicKey) {
        allCandidates.push({
          name: name,
          publicKey: candidatePublicKey,
        });
      }
    }
    return allCandidates;
  }
}

export default ZkAppService;
