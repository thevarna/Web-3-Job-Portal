"use client";
import JobsCard from "@/components/jobsCard";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useEffect, useState } from "react";

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  amount: number;
}

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([]);

  async function fetchJobs() {
    try {
      const response = await axios.get(`${BACKEND_URL}/jobs`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      setJobs(response.data);
    } catch (e) {
      console.error("Error fetching jobs", e);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="w-screen min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-mono font-bold mb-8 text-blue-500">
        Available Jobs
      </h1>
      {jobs.length === 0 ? (
        <div className="underline text-center font-mono mt-20 h-screen max-w-full text-3xl text-red-500">
          No jobs available right now :)
        </div>
      ) : (
        <div className="flex flex-col gap-10"> {/* Added gap between job cards */}
          {jobs.map((job) => (
            <JobsCard
              key={job.id}
              title={job.title}
              jobId={job.id}
              description={job.description}
              requirements={job.requirements}
              amount={job.amount}
            />
          ))}
        </div>
      )}
    </div>
  );
}

