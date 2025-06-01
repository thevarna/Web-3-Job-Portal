"use client"
import React, { Suspense } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BACKEND_URL } from "@/utils";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function ApplicationForm() {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [coverletter, setCoverletter] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const params = useSearchParams();
  const jobId = params.get("jobId");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/application`,
        {
          name,
          skills,
          coverletter,
          contactInfo,
          jobId,
        },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      alert("Application submitted successfully");
      setName("");
      setSkills([]);
      setCoverletter("");
      setContactInfo("");
      router.push("/jobs");
      console.log("Application submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  }

  return (
    <div className="bg-gray-900 text-white p-8 shadow-lg min-h-screen">
      <h2 className="text-2xl font-bold mb-6 font-mono text-blue-500">
        Application Form
      </h2>
      <form className="grid gap-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name
            </label>
            <Input
              onChange={(e) => setName(e.target.value)}
              id="name"
              placeholder="Enter your name"
              className="bg-gray-800 text-white w-64"
              value={name}
            />
          </div>
          <div>
            <label htmlFor="skills" className="block font-medium mb-1">
              Skills <span className="text-red-400">(comma-separated)</span>
            </label>
            <Textarea
              onChange={(e) => setSkills(e.target.value.split(",").map(skill => skill.trim()))}
              id="skills"
              rows={3}
              placeholder="Enter your skills"
              className="bg-gray-800 text-white"
              value={skills.join(",")}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="cover-letter" className="block font-medium mb-1">
              Cover Letter
            </label>
            <Textarea
              onChange={(e) => setCoverletter(e.target.value)}
              id="cover-letter"
              rows={5}
              placeholder="Enter your cover letter"
              className="bg-gray-800 text-white"
              value={coverletter}
            />
          </div>
          <div>
            <label htmlFor="contact" className="block font-medium mb-1">
              Contact Information
            </label>
            <Input
              onChange={(e) => setContactInfo(e.target.value)}
              id="contact"
              placeholder="Enter your contact information"
              className="bg-gray-800 text-white w-64"
              value={contactInfo}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="px-8 py-2 rounded-full bg-gradient-to-b from-green-500 to-green-600 text-white focus:ring-2 focus:ring-green-400 hover:shadow-xl transition duration-200"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplicationForm />
    </Suspense>
  );
}
