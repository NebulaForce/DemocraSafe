import {
  Field,
  SmartContract,
  state,
  State,
  method,
  Poseidon,
  PublicKey,
} from 'o1js';

export class VotationContract extends SmartContract {
  @state(Field) candidate1Hash = State<Field>();
  @state(Field) candidate2Hash = State<Field>();
  @state(Field) candidate3Hash = State<Field>();

  @state(Field) candidate1Votes = State<Field>();
  @state(Field) candidate2Votes = State<Field>();
  @state(Field) candidate3Votes = State<Field>();

  init() {
    super.init();

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

    this.candidate1Hash.set(Poseidon.hash(candidates[0].publicKey.toFields()));
    this.candidate2Hash.set(Poseidon.hash(candidates[1].publicKey.toFields()));
    this.candidate3Hash.set(Poseidon.hash(candidates[2].publicKey.toFields()));

    this.candidate1Votes.set(Field(0));
    this.candidate2Votes.set(Field(0));
    this.candidate3Votes.set(Field(0));
  }

  @method vote(vote: PublicKey) {
    const candidate1Hash = this.candidate1Hash.get();
    const candidate2Hash = this.candidate2Hash.get();
    const candidate3Hash = this.candidate3Hash.get();

    this.candidate1Hash.assertEquals(candidate1Hash);
    this.candidate2Hash.assertEquals(candidate2Hash);
    this.candidate3Hash.assertEquals(candidate3Hash);

    const voteHash = Poseidon.hash(vote.toFields());

    const voteForCandidate1 = voteHash.equals(candidate1Hash);
    const voteForCandidate2 = voteHash.equals(candidate2Hash);
    const voteForCandidate3 = voteHash.equals(candidate3Hash);

    voteForCandidate1.or(voteForCandidate2).or(voteForCandidate3).assertTrue('Vote does not match any existing candidate.');

    if (voteForCandidate1.toBoolean()) {
      const candidate1Votes = this.candidate1Votes.get();
      this.candidate1Votes.set(candidate1Votes.add(1));
    } else if (voteForCandidate2.toBoolean()) {
      const candidate2Votes = this.candidate2Votes.get();
      this.candidate2Votes.set(candidate2Votes.add(1));
    } else if (voteForCandidate3.toBoolean()) {
      const candidate3Votes = this.candidate3Votes.get();
      this.candidate3Votes.set(candidate3Votes.add(1));
    }
  }

  @method getWinners() {
    const candidate1Votes = this.candidate1Votes.get();
    const candidate2Votes = this.candidate2Votes.get();
    const candidate3Votes = this.candidate3Votes.get();

    const candidate1Hash = this.candidate1Hash.get();
    const candidate2Hash = this.candidate2Hash.get();
    const candidate3Hash = this.candidate3Hash.get();

    // Determine if Candidate 1 has the highest votes
    const isCandidate1Winner = candidate1Votes
      .greaterThanOrEqual(candidate2Votes)
      .and(candidate1Votes.greaterThanOrEqual(candidate3Votes));

    // Determine if Candidate 2 has the highest votes
    const isCandidate2Winner = candidate2Votes
      .greaterThanOrEqual(candidate1Votes)
      .and(candidate2Votes.greaterThanOrEqual(candidate3Votes));

    // Determine if Candidate 3 has the highest votes
    const isCandidate3Winner = candidate3Votes
      .greaterThanOrEqual(candidate1Votes)
      .and(candidate3Votes.greaterThanOrEqual(candidate2Votes));

    // Collect winners based on the results of the above comparisons
    const winners = [];
    if (isCandidate1Winner.toBoolean()) {
      winners.push(candidate1Hash);
    }
    if (isCandidate2Winner.toBoolean()) {
      winners.push(candidate2Hash);
    }
    if (isCandidate3Winner.toBoolean()) {
      winners.push(candidate3Hash);
    }

    return winners;
  }

}

