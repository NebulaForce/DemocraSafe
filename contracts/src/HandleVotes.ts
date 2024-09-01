import {
  Field,
  SmartContract,
  state,
  State,
  method,
  PublicKey,
  Poseidon,
  MerkleMapWitness,
} from 'o1js';

export class Votes extends SmartContract {
  // MerkleMap for candidates: key (PublicKey) => value (count of votes)
  @state(Field) candidates = State<Field>();

  // MerkleMap for voters: key (PublicKey) => value (1 if already voted)
  @state(Field) voters = State<Field>();

  /**
   * Initializes the state with the given Merkle roots.
   * @param initialRootCandidates Initial root for the candidates MerkleMap.
   * @param initialRootVoters Initial root for the voters MerkleMap.
   */
  @method initState(initialRootCandidates: Field, initialRootVoters: Field) {
    this.candidates.set(initialRootCandidates);
    this.voters.set(initialRootVoters);
  }

  /**
   * Handles the voting process by updating the Merkle roots for voters and candidates.
   * @param voterWitness Merkle proof for the voter.
   * @param candidateWitness Merkle proof for the candidate.
   * @param votesBefore Number of votes the candidate had before this vote.
   * @param voter Public key of the voter.
   * @param candidate Public key of the candidate.
   */
  @method vote(
    voterWitness: MerkleMapWitness,
    candidateWitness: MerkleMapWitness,
    votesBefore: Field,
    voter: PublicKey,
    candidate: PublicKey
  ) {
    // Validate the current state roots
    const votersRoot = this.voters.get();
    this.voters.assertEquals(votersRoot);

    const candidatesRoot = this.candidates.get();
    this.candidates.assertEquals(candidatesRoot);

    // Validate voter eligibility (has not voted yet)
    const [votersRootBefore, votersKey] = voterWitness.computeRootAndKey(Field(0));
    votersRootBefore.assertEquals(votersRoot, 'Voter root mismatch!');
    votersKey.assertEquals(Poseidon.hash(voter.toFields()), 'Voter key mismatch!');
    
    // Ensure the voter has not already voted
    const voterNotExists = votersRootBefore.equals(votersRoot);
    voterNotExists.assertTrue('Voter has already voted!');

    // Validate candidate and votes
    const [candidatesRootBefore, candidateKey] = candidateWitness.computeRootAndKey(votesBefore);
    candidatesRootBefore.assertEquals(candidatesRoot, 'Candidate root mismatch!');
    candidateKey.assertEquals(Poseidon.hash(candidate.toFields()), 'Candidate key mismatch!');

    // Update candidate votes
    const [candidatesAfter, _] = candidateWitness.computeRootAndKey(votesBefore.add(1));

    // Mark voter as having voted
    const [votersAfter, __] = voterWitness.computeRootAndKey(Field(1));

    // Update the state with new roots
    this.candidates.set(candidatesAfter);
    this.voters.set(votersAfter);
  }

  /**
   * A method to count votes (placeholder for additional logic).
   */
  @method countVotes() {
    const votersRoot = this.voters.get();
    this.voters.assertEquals(votersRoot);

    const candidatesRoot = this.candidates.get();
    this.candidates.assertEquals(candidatesRoot);
  }
}
