"use client";
import ResponseCard from "@/components/ResponseCard";
import { BACKEND_URL } from "@/utils";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

interface Responses {
  id: number;
  name: string;
  JobId: number;
  DeveloperId: number;
  coverLetter: string;
  Skills: string[];
  contactInforamtion: string;
  dateApplied: string;
  status: "PENDING" | "APPROVED" | "REJECT";
}

export default function Component() {
  const [responses, setResponses] = useState<Responses[]>([]);
  const { publicKey, sendTransaction } = useWallet();

  console.log("Wallet publicKey:", publicKey?.toString());

  const { connection } = useConnection();
  async function responseList() {
    try {
      const list = await axios.get(`${BACKEND_URL}/application`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setResponses(
        list.data.filter((res: Responses) => res.status === "PENDING")
      );
    } catch (e) {
      console.error("Error fetching responses", e);
    }
  }
  async function makePaymenttoParentWallet(amount: number) {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey!,
        toPubkey: new PublicKey("94A7ExXa9AkdiAnPiCYwJ8SbMuZdAoXnAhGiJqygmFfL"),
        lamports: amount * LAMPORTS_PER_SOL,
      })
    );
    const {
      context: { slot: minContextSlot },
      value: { blockhash, lastValidBlockHeight },
    } = await connection.getLatestBlockhashAndContext();
    const signature = await sendTransaction(transaction, connection, {
      minContextSlot,
    });

    await connection.confirmTransaction({
      blockhash,
      lastValidBlockHeight,
      signature,
    });
    return true;
  }

  async function onAccept(jobId: number, DeveloperId: number) {

    const userConfirmed = window.confirm("Accepting the application the amount assigned for the job will be debited from your wallet and sent to the escrow");

  if (!userConfirmed) {
    return; 
  }
    try {
      const { data } = await axios.get(`${BACKEND_URL}/job/${jobId}/amount`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      const amount = data.amount;

      const paymentSuccess = await makePaymenttoParentWallet(amount);
      if (paymentSuccess) {
        await axios.post(
          `${BACKEND_URL}/contract`,
          {
            jobId,
            DeveloperId,
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        alert("Contract created successfully");
      } else {
        alert("Payment failed. Contract not created.");
      }
      responseList();
    } catch (error) {
      console.error("Error creating contract:", error);
      alert("Failed to create contract/contract already exists.");
    }
  }

  async function onReject(jobId: number, DeveloperId: number) {
    try {
      await axios.delete(`${BACKEND_URL}/application/${jobId}/${DeveloperId}`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      alert("Application rejected successfully");
      responseList();
    } catch (error) {
      console.error("Error deleting application:", error);
      alert("Failed to delete application");
    }
  }
  
  useEffect(() => {
    responseList();
    const intervalId = setInterval(() => {
      responseList(); 
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);


  

  return (
    <div className="bg-gray-900 pb-5 min-h-screen">
      <h1 className="text-3xl font-bold text-center pt-10 font-mono text-green-500">
        JOB RESPONSES<br/>
        <span className="text-red-500 text-sm">(In case of an error while creating the contract, please re-login. The issue might be due to a transaction timeout.)</span>
      </h1>
      {responses.length === 0 ? (
        <div className=" underline text-center font-mono mt-20 h-screen max-w-full text-3xl text-red-500">No responses at this time:)</div>
      ) : (
        responses.map((res) => (
        <ResponseCard
          key={res.id}
          name={res.name}
          jobId={res.JobId}
          DeveloperId={res.DeveloperId}
          coverletter={res.coverLetter}
          date={res.dateApplied}
          contact={res.contactInforamtion}
          skills={res.Skills}
          onAccept={onAccept}
          onReject={onReject}
        />
      )))
    }
    </div>
  );
}
