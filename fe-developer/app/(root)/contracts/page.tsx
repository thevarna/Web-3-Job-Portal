"use client";
import ContractCard from "@/components/contractsCard";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useEffect, useState } from "react";

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
}

interface ContractProps {
  id: number;
  jobId: number;
  DeveloperId: number;
  status: "REJECTED" | "IN_PROGRESS" | "COMPLETED";
  submissonLink: string | null; 
  Job: Job;
}

export default function Component() {
  useEffect(() => {
    fetchContracts();
  }, []);
  const [contracts, setContracts] = useState<ContractProps[]>([]);
  async function fetchContracts() {
    try {
      const response = await axios.get(`${BACKEND_URL}/contract`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      });
      setContracts(response.data);
      console.log("Contracts fetched from backend:", response.data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  }

  async function handleSubmit(submissionLink :string, id : number ) {
    try {
      const submit = await axios.post(
        `${BACKEND_URL}/submission`,
        {
          submissionLink,
          contractId : id,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      console.log(submit)
      alert("Submission sent successfully")
      fetchContracts()
    } catch (error) {
      console.error("Error submitting link:", error);
    }
  }
  const activeContracts = contracts.filter(contract => !contract.submissonLink);
  const pastContracts = contracts.filter(contract => contract.submissonLink);

  return (
    <div className="bg-gray-900 min-h-screen p-10">
      <h1 className="text-4xl font-bold font-mono text-blue-500 p-7 text-center">
        Active Contracts
      </h1>
      {activeContracts.length === 0 ? (
        <div className="text-center text-lg text-white">
          No active contracts at the moment.
        </div>
      ) : (
        activeContracts.map((contract) => (
          <ContractCard
            key={contract.id}
            jobID={contract.jobId}
            title={contract.Job.title}
            description={contract.Job.description}
            status={contract.status}
            submissonLink={contract.submissonLink}
            onSubmit={(link) => handleSubmit(link, contract.id)}
          />
        ))
      )}

      <h2  className="text-4xl font-bold font-mono text-blue-500 p-7 text-center">
        Past Contracts
      </h2>
      {pastContracts.length === 0 ? (
        <div className="text-center text-white">
          No past contracts to display.
        </div>
      ) : (
        pastContracts.map((contract) => (
          <ContractCard
            key={contract.id}
            jobID={contract.jobId}
            title={contract.Job.title}
            description={contract.Job.description}
            status={contract.status}
            submissonLink={contract.submissonLink}
            onSubmit={(link) => handleSubmit(link, contract.id)}
          />
          
        ))
        
      )}
      
    </div>
  );
}

