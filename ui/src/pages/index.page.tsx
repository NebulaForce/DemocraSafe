import Head from "next/head";
import { useEffect } from "react";

import { PrivateKey } from "o1js";
import ZkAppService from "./service/contract.service";

export default function Home() {
  useEffect(() => {
    (async () => {

      const zkAppService = new ZkAppService();
      try {
        await zkAppService.initialize(); //important init the service


        const candidatePublicKey = PrivateKey.random().toPublicKey();//fake key
        console.log("candidatePublicKey", candidatePublicKey);

        await zkAppService.createCandidate(candidatePublicKey, "Test");// save candidate
        console.log("candidates", zkAppService.getAllCandidates());//get all candidates

        await zkAppService.castVote(
          PrivateKey.random().toPublicKey(),//your wallet public key
          candidatePublicKey
        );//send a vote

        console.log("winner", zkAppService.getWinner()); //print the winners

      } catch (error) {
        console.error("Error interacting with zkApp:", error);
        console.log("An error occurred");
      }
    })();
  }, []);

  return (
    <>
      <Head>
        <title>DemocraSafe</title>
        <meta name="description" content="The cutting-edge zkApp designed to revolutionize how we vote." />
        <link rel="icon" href="/assets/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
        />
      </Head>
      <></>
    </>
  );
}
