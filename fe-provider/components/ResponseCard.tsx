import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ResponseCardProps {
  name: string;
  date: string;
  coverletter: string;
  skills: string[];
  contact: number | string;
  jobId: number;
  DeveloperId: number;
  onAccept: (jobId: number, DeveloperId: number) => void;
  onReject: (jobId: number, DeveloperId: number) => void;
}

export default function ResponseCard({
  name,
  date,
  coverletter,
  skills = [],
  contact,
  jobId,
  DeveloperId,
  onAccept,
  onReject,
}: ResponseCardProps) {
  return (
    <Card className="w-full max-w-4xl mx-auto mb-4 bg-gray-900 text-white border border-gray-900">
      <CardHeader></CardHeader>
      <CardContent className="grid gap-4 pb-2 ">
        <div className="border border-gray-800 rounded-lg overflow-hidden bg-gray-800">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-700 border-b border-gray-800">
            <div className="font-bold text-lg uppercase">
              {name}{" "}
              <span className="text-blue-400">DEV ID: {DeveloperId} </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAccept(jobId, DeveloperId)}
                className="px-4 py-2 rounded-md font-semibold bg-green-500 text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
              >
                ACCEPT
              </button>
              <button
                onClick={() => onReject(jobId, DeveloperId)}
                className="px-4 py-2 rounded-md font-semibold bg-red-500 text-white text-sm hover:-translate-y-1 transform transition duration-200 hover:shadow-md"
              >
                REJECT
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 pr-6">
            <div className="space-y-2">
              <div className="text-sm text-gray-400 font-bold">
                Date Applied
              </div>
              <div>{date}</div>
              <div className="text-red-400 ">JOB ID: {jobId} </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-400 font-bold">Skills</div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-600 text-gray-200 py-1 px-3 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2 col-span-2">
              <div className="text-sm text-gray-400 font-bold">
                Cover Letter
              </div>
              <div className="prose text-gray-300 max-w-none">
                <p>{coverletter}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-gray-400 font-bold">Contact</div>
              <div>{contact}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
