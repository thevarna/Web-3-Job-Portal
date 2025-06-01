"use client";

import { useRouter } from "next/navigation";
import { BackgroundGradient } from "./ui/background-gradient";
interface jobsCardProps {
  title: string;
  description: string;
  requirements: string;
  amount: number;
  jobId: number;
}
export default function JobsCard({
  title,
  description,
  requirements,
  amount,
  jobId,
}: jobsCardProps) {
  const router = useRouter();

  const handleApplyClick = () => {
    const url = `/applicationForm?jobId=${jobId}`;
    router.push(url);
  };

  return (
    <BackgroundGradient className="rounded-[22px]">
      <div className="flex flex-col gap-8">
        <div className="bg-gray-900 shadow-md overflow-hidden rounded-[22px]  ">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">
              {title}
              <br />{" "}
              <span className="font-mono  text-red-400 text-base">
                JOB ID: {jobId}
              </span>
            </h2>
            <p className="text-gray-400 mb-4">{description}</p>
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Requirements:</h3>
              <ul className="list-disc pl-6">
                <li>{requirements}</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-bold mb-2">Salary Range:</h3>
              <p>  {amount} SOL</p>
            </div>
            <button
              onClick={handleApplyClick}
              type="button"
              className="px-8 py-0.5  border-2 border-black dark:border-white uppercase bg-green-600 text-black transition duration-200 text-sm shadow-[1px_1px_rgba(0,0,0),2px_2px_rgba(0,0,0),3px_3px_rgba(0,0,0),4px_4px_rgba(0,0,0),5px_5px_0px_0px_rgba(0,0,0)] dark:shadow-[1px_1px_rgba(255,255,255),2px_2px_rgba(255,255,255),3px_3px_rgba(255,255,255),4px_4px_rgba(255,255,255),5px_5px_0px_0px_rgba(255,255,255)] "
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </BackgroundGradient>
  );
}
/*
"use client";
import React from "react";

import { IconAppWindow } from "@tabler/icons-react";
import Image from "next/image";
import { BackgroundGradient } from "./ui/background-gradient";

export function BackgroundGradientDemo() {
  return (
    <div>
      <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
      
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          Air Jordan 4 Retro Reimagined
        </p>

        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          The Air Jordan 4 Retro Reimagined Bred will release on Saturday,
          February 17, 2024. Your best opportunity to get these right now is by
          entering raffles and waiting for the official releases.
        </p>
        <button className="rounded-full pl-4 pr-1 py-1 text-white flex items-center space-x-1 bg-black mt-4 text-xs font-bold dark:bg-zinc-800">
          <span>Buy now </span>
          <span className="bg-zinc-700 rounded-full text-[0.6rem] px-2 py-0 text-white">
            $100
          </span>
        </button>
      </BackgroundGradient>
    </div>
  );
}
*/
