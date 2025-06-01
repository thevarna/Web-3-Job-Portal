"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { BackgroundGradient } from "./ui/background-gradient";

interface ContractCardProps {
  jobID: number;
  title: string;
  description: string;
  status: "REJECTED" | "IN_PROGRESS" | "COMPLETED";
  submissonLink: string | null; 
  onSubmit: (link: string) => void;
}

export default function ContractCard({
  jobID,
  title,
  description,
  status,
  submissonLink,
  onSubmit
}: ContractCardProps) {
  const [link, setLink] = useState(submissonLink || "");

  const handleSubmit = () => {
    onSubmit(link);
  }

  const getBadgeColor = (status: "REJECTED" | "IN_PROGRESS" | "COMPLETED") => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500 text-green-900";
      case "IN_PROGRESS":
        return "bg-yellow-500 text-yellow-900";
      default:
        return "bg-red-500 text-gray-900";
    }
  };
  
  const badgeColor = getBadgeColor(status);
  
  return (
    
    <div className="w-full max-w-3xl mx-auto py-8 px-4 md:px-6 pt-2  ">
      <BackgroundGradient className="rounded-[22px]">
      <div className="flex items-center justify-between "></div>
      <div className="grid gap-4">
        <Card className="bg-gray-800 border-gray-900 rounded-[22px]">
          <CardHeader>
            <div className="flex items-center justify-between ">
              <div className="font-medium text-white">
                <div className="font-mono font-bold text-red-400 text-base">
                  JOB ID : {jobID}
                </div>
              </div>
              <Badge className={badgeColor} variant="secondary">
                {status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-white pb-4 ">
                  <span className="uppercase text-blue-400">Job Title : </span>{" "}
                  <span className="text-blue-400 underline">{title}</span>
                </div>
                <div className=" text-muted-foreground text-sm text-white">
                  {description}
                </div>
              </div>
            </div>
            <Separator className="my-4 bg-gray-90" />

            {submissonLink === null  ? (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter link related to this contract"
                  className="flex-1 "
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
                <button
                  onClick={handleSubmit}
                  className="font-medium px-8 py-2 rounded-full bg-gradient-to-b from-green-500 to-green-600 text-white focus:ring-2 focus:ring-green-400 hover:shadow-xl transition duration-200"
                >
                  Submit
                </button>
              </div>
            ) : (
              <div className="text-red-500 ">Submission Link: {submissonLink}</div>
            )}
          </CardContent>
        </Card>
      </div>
      </BackgroundGradient>
    </div>
    
  );
}

