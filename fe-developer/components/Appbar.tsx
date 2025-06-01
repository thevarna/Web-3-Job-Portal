import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";

export default function Appbar() {
  const { disconnect } = useWallet();
  const router = useRouter();
  const handleDisconnect = () => {
    localStorage.removeItem("token")
    disconnect();
    router.push("/");
  };
  return (
    <header className="bg-gray-800 text-primary-foreground py-4 px-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage your job postings and applications
        </p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/jobs")}
          className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 "
        >
          Jobs
        </button>
        <button
          onClick={() => router.push("/contracts")}
          className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 "
        >
         Contracts
        </button>

        <button
          onClick={handleDisconnect}
          className="px-3 py-1 rounded-md bg-red-500 font-semibold font-mono transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500"
        >
          Disconnect Wallet
        </button>
      </div>
    </header>
  );
}
