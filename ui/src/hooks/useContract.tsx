// Based on mina/o1labs docs: https://github.com/o1-labs/docs2/blob/main/examples/zkapps/04-zkapp-browser-ui/ui/src/pages/index.page.tsx
// Adapted to work with HandleVotes contract

import { useEffect, useState } from 'react';
import ZkappWorkerClient from '../pages/zkAppWorkerClient';
import { PublicKey } from 'o1js';

interface IContractReturn {
    setup: JSX.Element;
    accountDoesNotExist: JSX.Element;
    hasBeenSetup: boolean;
    accountExists: boolean;
    onSendTransaction: () => void;
    onRefreshCandidates: () => void;
    onCountAllVotes: () => void;
}

const useContractAndWallet = (): IContractReturn => {

    let transactionFee = 0.1;
    const ZKAPP_ADDRESS = 'B62qpXPvmKDf4SaFJynPsT6DyvuxMS9H1pT4TGonDT26m599m7dS9gP'; //todo: update with contract address

    const [state, setState] = useState({
        zkappWorkerClient: null as null | ZkappWorkerClient,
        hasWallet: null as null | boolean,
        hasBeenSetup: false,
        accountExists: false,

        candidates: null as null | any,

        publicKey: null as null | PublicKey,
        zkappPublicKey: null as null | PublicKey,
        creatingTransaction: false,
    });

    const [displayText, setDisplayText] = useState('');
    const [transactionlink, setTransactionLink] = useState('');

    useEffect(() => {
        async function timeout(seconds: number): Promise<void> {
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    resolve();
                }, seconds * 1000);
            });
        }

        (async () => {
            if (!state.hasBeenSetup) {
                setDisplayText('Loading web worker...');
                const zkappWorkerClient = new ZkappWorkerClient();
                await timeout(5);

                setDisplayText('Done loading web worker');
                await zkappWorkerClient.setActiveInstanceToDevnet();

                setDisplayText('Done setting Active Instance to Devnet');

                const mina = (window as any).mina;

                if (mina == null) {
                    setState({ ...state, hasWallet: false });
                    return;
                }

                const publicKeyBase58: string = (await mina.requestAccounts())[0];
                const publicKey = PublicKey.fromBase58(publicKeyBase58);

                setDisplayText(`Using key:${publicKey.toBase58()}`);

                setDisplayText('Checking if fee payer account exists...');

                const res = await zkappWorkerClient.fetchAccount({
                    publicKey: publicKey!,
                });
                const accountExists = res.error == null;

                await zkappWorkerClient.loadContract();

                setDisplayText('Compiling zkApp...');
                await zkappWorkerClient.compileContract();
                setDisplayText('zkApp compiled...');

                const zkappPublicKey = PublicKey.fromBase58(ZKAPP_ADDRESS);

                await zkappWorkerClient.initZkappInstance(zkappPublicKey);

                setDisplayText('Getting zkApp state...');

                const candidates = await zkappWorkerClient.getCandidates();

                setDisplayText('');

                setState({
                    ...state,
                    zkappWorkerClient,
                    hasWallet: true,
                    hasBeenSetup: true,
                    candidates,
                    publicKey,
                    zkappPublicKey,
                    accountExists,

                });
            }
        })();
    }, []);

    // -------------------------------------------------------
    // Wait for account to exist, if it didn't

    useEffect(() => {
        (async () => {
            if (state.hasBeenSetup && !state.accountExists) {
                for (; ;) {
                    setDisplayText('Checking if fee payer account exists...');
                    const res = await state.zkappWorkerClient!.fetchAccount({
                        publicKey: state.publicKey!,
                    });
                    const accountExists = res.error == null;
                    if (accountExists) {
                        break;
                    }
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                }
                setState({ ...state, accountExists: true });
            }
        })();
    }, [state.hasBeenSetup]);

    // -------------------------------------------------------
    // Send a transaction

    const onSendTransaction = async () => {

        const userResponse = window.prompt('Enter your vote Address'); //todo: update this to use the data from the FE form

        setState({ ...state, creatingTransaction: true });

        setDisplayText('Creating a transaction...');

        await state.zkappWorkerClient!.fetchAccount({
            publicKey: state.publicKey!,
        });

        await state.zkappWorkerClient!.vote(userResponse!);

        setDisplayText('Creating proof...');
        await state.zkappWorkerClient!.proveUpdateTransaction();

        setDisplayText('Requesting send transaction...');
        const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON();

        setDisplayText('Getting transaction JSON...');
        const { hash } = await (window as any).mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                fee: transactionFee,
                memo: '',
            },
        });

        const transactionLink = `https://minascan.io/devnet/tx/${hash}type=zk-tx`;

        setTransactionLink(transactionLink);
        setDisplayText(transactionLink);

        setState({ ...state, creatingTransaction: false });
    };

    // -------------------------------------------------------
    // Refresh the current state with candidates

    const onRefreshCandidates = async () => {
        setDisplayText('Getting zkApp state...');

        await state.zkappWorkerClient!.fetchAccount({
            publicKey: state.zkappPublicKey!,
        });

        const candidates = await state.zkappWorkerClient!.getCandidates();

        setState({ ...state, candidates });
        setDisplayText('');
    };

    // -------------------------------------------------------
    // Refresh the current state with votes

    const onCountAllVotes = async () => {
        setDisplayText('Getting zkApp state...');

        await state.zkappWorkerClient!.fetchAccount({
            publicKey: state.zkappPublicKey!,
        });

        setState({ ...state, creatingTransaction: true });

        setDisplayText('Creating a transaction...');

        await state.zkappWorkerClient!.fetchAccount({
            publicKey: state.publicKey!,
        });

        await state.zkappWorkerClient!.countVotes();

        setDisplayText('Creating proof...');
        await state.zkappWorkerClient!.proveUpdateTransaction();

        setDisplayText('Requesting send transaction...');
        const transactionJSON = await state.zkappWorkerClient!.getTransactionJSON();

        setDisplayText('Getting transaction JSON...');
        const { hash } = await (window as any).mina.sendTransaction({
            transaction: transactionJSON,
            feePayer: {
                fee: transactionFee,
                memo: '',
            },
        });

        const transactionLink = `https://minascan.io/devnet/tx/${hash}type=zk-tx`;

        setTransactionLink(transactionLink);
        setDisplayText(transactionLink);

        setState({ ...state, creatingTransaction: false });
    };

    // -------------------------------------------------------
    // Create UI elements

    let hasWallet;
    if (state.hasWallet != null && !state.hasWallet) {
        const auroLink = 'https://www.aurowallet.com/';
        const auroLinkElem = (
            <a href={auroLink} target="_blank" rel="noreferrer" >
                Install Auro wallet here
            </a>
        );
        hasWallet = (
            <div>
                Could not find a wallet. {auroLinkElem}
            </div>
        );
    }

    const stepDisplay = transactionlink ? (
        <a href={displayText} target="_blank" rel="noreferrer" >
            View transaction
        </a>
    ) : (
        displayText
    );


    let setup = (
        <div
            style={{ fontWeight: 'bold', fontSize: '1.5rem', paddingBottom: '5rem' }}
        >
            {stepDisplay}
            {hasWallet}
        </div>
    );

    let accountDoesNotExist = (<div></div>);
    if (state.hasBeenSetup && !state.accountExists) {
        const faucetLink =
            'https://faucet.minaprotocol.com/?address=' + state.publicKey!.toBase58();
        accountDoesNotExist = (
            <div>
                Account does not exist.
                < a href={faucetLink} target="_blank" rel="noreferrer" >
                    Visit the faucet to fund this fee payer account
                </a>
            </div>
        );
    }

    return {
        setup,
        accountDoesNotExist,
        hasBeenSetup: state.hasBeenSetup,
        accountExists: state.accountExists,
        onSendTransaction,
        onRefreshCandidates,
        onCountAllVotes,
    }
};

export default useContractAndWallet;
