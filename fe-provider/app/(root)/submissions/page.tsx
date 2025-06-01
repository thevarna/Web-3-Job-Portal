"use client";
import SubmissionCard from "@/components/submissionCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/utils";

interface submissionProps {
  id: number;
  JobId: number;
  title: string;
  submissonLink: string;
  status: "COMPLETED" | "IN_PROGRESS" | "REJECTED";
  Job: {
    id: number;
    title: string;
  };
}

export default function Component() {
  useEffect(() => {
    fetchsubmissions();
  }, []);

  const [submission, setSubmission] = useState<submissionProps[]>([]);
  async function fetchsubmissions() {
    const response = await axios.get(`${BACKEND_URL}/submission`, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    });

    setSubmission(response.data);
  }

  async function onAccept(contractId: number) {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/payment`,
        { contractId },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      alert("Amount dispenced to developer");
      fetchsubmissions();
    } catch (error) {
      console.error("Error accepting submission", error);
    }
  }

  async function onReject(contractId: number) {
    try {
      const response = await axios.post(
        `${BACKEND_URL}/reject`,
        { contractId },
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      fetchsubmissions();
    } catch (error) {
      console.error("Error rejecting submission", error);
    }
  }

  const currentSubmissions = submission.filter(
    (sub) => sub.status === "IN_PROGRESS"
  );
  const pastSubmissions = submission.filter(
    (sub) => sub.status === "COMPLETED" || sub.status === "REJECTED"
  );

  return (
    <div className="bg-gray-900 min-h-screen pt-5 pb-5">
      <div className="container mx-auto my-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 font-mono text-green-500">
          Review Job Submissions
        </h1>
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-900">
            {/* Current Submissions */}
            <div className="px-6 py-4 bg-gray-800 flex items-center justify-between">
              <div className="font-medium text-white">Current Submissions</div>
            </div>
            <div className="px-6 py-4">
              {currentSubmissions.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {currentSubmissions.map((sub) => (
                    <SubmissionCard
                      key={sub.id}
                      id={sub.id}
                      JobId={sub.Job.id}
                      title={sub.Job.title}
                      submissonLink={sub.submissonLink}
                      onAccept={onAccept}
                      onReject={onReject}
                      status={sub.status}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-red-500 border-0">
                  No current submissions :D
                </p>
              )}
            </div>

            {/* Past Submissions */}
            <div className="px-6 py-4 bg-gray-800 flex items-center justify-between">
              <div className="font-medium text-white">Past Submissions</div>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pastSubmissions.map((sub) => (
                  <SubmissionCard
                    key={sub.id}
                    id={sub.id}
                    JobId={sub.Job.id}
                    title={sub.Job.title}
                    submissonLink={sub.submissonLink}
                    onAccept={onAccept}
                    onReject={onReject}
                    status={sub.status}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
