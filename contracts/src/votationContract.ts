import {
  Field,
  SmartContract,
  state,
  State,
  method,
  Provable,
  Reducer,
  Circuit,
  Poseidon,
  PublicKey,
  Bool,
} from 'o1js';

export class VotationContract extends SmartContract {
  @state(Field) actionState = State<Field>();

  // State variables for candidate hashes
  @state(Field) candidate1Hash = State<Field>();
  @state(Field) candidate2Hash = State<Field>();
  @state(Field) candidate3Hash = State<Field>();

  // State variables for candidate vote counts
  @state(Field) candidate1Votes = State<Field>();
  @state(Field) candidate2Votes = State<Field>();
  @state(Field) candidate3Votes = State<Field>();

  reducer = Reducer({ actionType: Field });

  init() {
    super.init();

    // Candidate information
    const candidates = [
      {
        name: 'Candidate 1',
        publicKey: PublicKey.fromBase58(
          'B62qkhh2d4qMZ41qcXMNUt1XwFr5EyNfCM68vVXa69ESrWFFkgNrT5Y'
        ),
      },
      {
        name: 'Candidate 2',
        publicKey: PublicKey.fromBase58(
          'B62qj3DevXeeim5uEY9jVf9Gvd2tHbko4G62x2zp39NbkJhP3HW7zqL'
        ),
      },
      {
        name: 'Candidate 3',
        publicKey: PublicKey.fromBase58(
          'B62qjtHSupUKstEDPuQ4q8Ay9Pum6ZhsiwRAWG9N1EiCDYp7cEBPqqv'
        ),
      },
    ];

    // Initialize state for candidates' hashes and vote counts
    this.candidate1Hash.set(Poseidon.hash(candidates[0].publicKey.toFields()));
    this.candidate2Hash.set(Poseidon.hash(candidates[1].publicKey.toFields()));
    this.candidate3Hash.set(Poseidon.hash(candidates[2].publicKey.toFields()));

    this.candidate1Votes.set(Field(0));
    this.candidate2Votes.set(Field(0));
    this.candidate3Votes.set(Field(0));

    this.actionState.set(Reducer.initialActionState);
  }


  @method vote(vote: PublicKey) {
    // Fetch and assert candidate hashes from state
    const candidate1Hash = this.candidate1Hash.get();
    const candidate2Hash = this.candidate2Hash.get();
    const candidate3Hash = this.candidate3Hash.get();
    this.candidate1Hash.assertEquals(candidate1Hash);
    this.candidate2Hash.assertEquals(candidate2Hash);
    this.candidate3Hash.assertEquals(candidate3Hash);
  
    // Hash the voter's public key
    const voteHash = Poseidon.hash(vote.toFields());
  
    // Check if the vote matches any candidate hash
    const candidateExists = voteHash.equals(candidate1Hash)
      .or(voteHash.equals(candidate2Hash))
      .or(voteHash.equals(candidate3Hash));
  
    candidateExists.assertTrue('Vote does not match any existing candidate.');
  
    // Dispatch the vote to be processed by the reducer
    this.reducer.dispatch(voteHash);
  }
  
  
}
