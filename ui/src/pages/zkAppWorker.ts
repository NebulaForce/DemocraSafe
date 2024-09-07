// Based on mina/o1labs docs: https://github.com/o1-labs/docs2/blob/main/examples/zkapps/04-zkapp-browser-ui/ui/src/pages/zkappWorker.ts
// Adapted to work with HandleVotes contract

import { Mina, PublicKey, fetchAccount } from 'o1js';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { Votes } from '../../../contracts/src/HandleVotes';

const state = {
  Votes: null as null | typeof Votes,
  zkapp: null as null | Votes,
  transaction: null as null | Transaction,
};

// ---------------------------------------------------------------------------------------

const functions = {
  setActiveInstanceToDevnet: async (args: {}) => {
    const Network = Mina.Network(
      'https://api.minascan.io/node/devnet/v1/graphql'
    );
    console.log('Devnet network instance configured.');
    Mina.setActiveInstance(Network);
  },
  loadContract: async (args: {}) => {
    const { Votes } = await import('.././../../contracts/build/src/HandleVotes');
    state.Votes = Votes;
  },
  compileContract: async (args: {}) => {
    await state.Votes!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.Votes!(publicKey);
  },
  // todo: add functions to interact with the contract

  // getNum: async (args: {}) => {
  //   const currentNum = await state.zkapp!.num.get();
  //   return JSON.stringify(currentNum.toJSON());
  // },
  // createUpdateTransaction: async (args: {}) => {
  //   const transaction = await Mina.transaction(async () => {
  //     await state.zkapp!.update();
  //   });
  //   state.transaction = transaction;
  // },
  proveUpdateTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};

if (typeof window !== 'undefined') {
  addEventListener(
    'message',
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
      };
      postMessage(message);
    }
  );
}

console.log('Web Worker Successfully Initialized.');
