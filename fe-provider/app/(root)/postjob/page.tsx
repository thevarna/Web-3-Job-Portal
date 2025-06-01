"use client";

import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/utils";

export default function Component() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [amount, setAmount] = useState("");

  async function jobSubmit(e: any) {
    e.preventDefault(); 
    try {
      const response = await axios.post(`${BACKEND_URL}/postjob`, {
        title,
        description,
        requirements,
        amount,
      },{
        headers: {
          "Authorization": localStorage.getItem("token")
        }
      });
      alert("Job posted successfully");
      
     
      setTitle("");
      setDescription("");
      setRequirements("");
      setAmount("");
    } catch (error) {
      console.error("Error posting job", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold font-mono text-green-500">
              Post a Job
            </h1>
            <p className="text-lg text-blue-400">Upchain.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3">Job Posting</h2>
            <form className="space-y-4" onSubmit={jobSubmit}> {/* Add form element */}
              <div>
                <label htmlFor="job-title" className="block text-gray-400">
                  Job Title
                </label>
                <input
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  id="job-title"
                  className="w-full rounded-md bg-gray-800 px-4 py-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="job-description" className="block text-gray-400">
                  Job Description
                </label>
                <textarea
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  id="job-description"
                  rows={5}
                  className="w-full rounded-md bg-gray-800 px-4 py-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="job-requirements" className="block text-gray-400">
                  Job Requirements
                </label>
                <textarea
                  value={requirements} 
                  onChange={(e) => setRequirements(e.target.value)}
                  id="job-requirements"
                  rows={5}
                  className="w-full rounded-md bg-gray-800 px-4 py-2 text-white focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="job-salary" className="block text-gray-400">
                  Amount
                  <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] text-transparent bg-clip-text">
                    (IN SOL)
                  </span>
                </label>
                <input
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  id="job-salary"
                  className="w-full rounded-md bg-gray-800 px-4 py-2 text-white focus:outline-none"
                />
              </div>
              <button
                type="submit" 
                className="px-8 py-0.5 border-2 border-black dark:border-white uppercase bg-green-600 text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)]"
              >
                Post Job
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
