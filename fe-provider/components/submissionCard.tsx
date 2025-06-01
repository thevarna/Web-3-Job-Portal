import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SubmissionCardProps {
  JobId: number;
  title: string;
  submissonLink: string;
  onAccept: (contractId: number) => void;
  onReject: (contractId: number) => void;
  id: number;
  status: "COMPLETED" | "IN_PROGRESS" | "REJECTED"; 
}

export default function SubmissionCard({ JobId, title, submissonLink,onAccept,onReject,id,status}: SubmissionCardProps) {

  function CopyToClipboard(url: string) {
    navigator.clipboard.writeText(submissonLink);
    alert("Copied to clipboard!");
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 text-white my-3">
      <div className="flex items-center justify-between mb-4">
        <div className="font-medium">
          <span>Job ID:</span> {JobId}
        </div>
        <div className="">Name :<span className="font-medium uppercase text-blue-500"> {title}</span></div>
        <div className="flex items-center space-x-2">
          {status === "IN_PROGRESS" && ( 
            <>
              <button
                onClick={() => onAccept(id)}
                className="px-2 py-2 rounded-md font-semibold bg-green-500 text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
              >
                APPROVE
              </button>
              <button
                onClick={() => onReject(id)}
                className="px-2 py-2 rounded-md font-semibold bg-red-500 text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
              >
                REJECT
              </button>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center font-medium">
        <Input
          type="text"
          value={submissonLink}
          readOnly
          className="flex-1 text-black bg-white rounded-md shadow-sm border-gray-300"
        />
        <button
          onClick={() => CopyToClipboard(submissonLink)}
          className="ml-2 bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block"
        >
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
            <span>Copy</span>
            <svg
              fill="none"
              height="16"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.75 8.75L14.25 12L10.75 15.25"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
        </button>
      </div>
    </div>
  );
}