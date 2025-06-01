import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Router } from "express";
import nacl from "tweetnacl";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { middleware_provider } from "./middleware";
import bs58 from "bs58";
const router = Router();
const prisma = new PrismaClient();
const parentWallet = "94A7ExXa9AkdiAnPiCYwJ8SbMuZdAoXnAhGiJqygmFfL";
const connection = new Connection(process.env.RPC_URL||clusterApiUrl('mainnet-beta'));
require("dotenv").config();

router.post("/reject", async (req, res) => {
  const { contractId } = req.body;

  if (!contractId) {
    return res.status(400).json({ message: "Contract ID is required" });
  }

  try {
    const updatedContract = await prisma.contract.update({
      where: {
        id: contractId,
      },
      data: {
        status: "REJECTED",
      },
      include: {
        Job: true,
      },
    });

    const updatedJob = await prisma.job.update({
      where: {
        id: updatedContract.jobId,
      },
      data: {
        developerId: null,
      },
    });
    const deletedApplications = await prisma.application.deleteMany({
      where: {
        JobId: updatedContract.jobId,
        DeveloperId: updatedContract.DeveloperId,
      },
    });

    res.json({
      message: "Contract rejected and job reposted",
      updatedContract,
      updatedJob,
      deletedApplications,
    });
  } catch (error) {
    console.error("Error processing rejection:", error);
    res.status(500).json({ message: "Error processing rejection" });
  }
});

router.post("/payment", middleware_provider, async (req, res) => {
  const PRIVATE_KEY = (process.env.PRIVATE_KEY || "").trim();
 
  const { contractId } = req.body;
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        Job: { select: { amount: true } },
        Developer: { select: { address: true } },
      },
    });

    if (!contract || contract.status !== "IN_PROGRESS") {
      return res.status(400).json({ message: "Invalid contract status" });
    }

    const payment = await prisma.$transaction(async (tx) => {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(parentWallet),
          toPubkey: new PublicKey(contract.Developer.address),
          lamports: contract.Job.amount * LAMPORTS_PER_SOL,
        })
      );

      try {
        const keyPair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));

        const signature = await sendAndConfirmTransaction(
          connection,
          transaction,
          [keyPair]
        );

        await tx.contract.update({
          where: { id: contractId },
          data: { status: "COMPLETED" },
        });

        return { contract, signature };
      } catch (error: any) {
        console.error("Error processing payment:", error.message);
        throw new Error("Payment processing failed");
      }
    });

    return res.status(200).json(payment);
  } catch (error: any) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
});


router.get("/submission", middleware_provider, async (req, res) => {
  //@ts-ignore
  const jobProviderId = req.providerId;
  try {
    const submissions = await prisma.contract.findMany({
      where: {
        Job: {
          jobProviderId: jobProviderId,
        },
        submissonLink: {
          not: null,
        },
      },
      select: {
        id: true,
        submissonLink: true,
        status: true,
        Job: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: "Error fetching submissions" });
  }
});

router.get("/job/:jobId/amount", middleware_provider, async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await prisma.job.findUnique({
      where: {
        id: Number(jobId),
      },
      select: {
        amount: true,
      },
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ amount: job.amount });
  } catch (error) {
    console.error("Error fetching job amount:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/application/:jobId/:developerId", async (req, res) => {
  const { jobId, developerId } = req.params;
  if (!jobId || !developerId) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    await prisma.application.deleteMany({
      where: {
        JobId: Number(jobId),
        DeveloperId: Number(developerId),
      },
    });
    res.status(200).json({ message: "Application rejected successfully" });
  } catch (error) {
    console.error("Error rejecting application:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/contract", middleware_provider, async (req, res) => {
  const { jobId, DeveloperId } = req.body;
  if (!jobId || !DeveloperId) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const existingContract = await prisma.contract.findUnique({
      where: {
        jobId,
      },
    });
    if (existingContract) {
      return res
        .status(400)
        .json({ message: "Contract already exists for this job" });
    }
    const contract = await prisma.contract.create({
      data: {
        jobId: jobId,
        DeveloperId: DeveloperId,
        status: "IN_PROGRESS",
      },
    });

    await prisma.application.updateMany({
      where: {
        JobId: jobId,
        DeveloperId: DeveloperId,
      },
      data: {
        status: "APPROVED",
      },
    });

    await prisma.job.update({
      where: {
        id: jobId,
      },
      data: {
        developerId: DeveloperId,
      },
    });

    res.status(201).json(contract);
  } catch (error) {
    console.error("Error creating contract:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/jobs", middleware_provider, async (req, res) => {
  //@ts-ignore
  const jobProviderId = req.providerId;
  try {
    if (!jobProviderId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const jobs = await prisma.job.findMany({
      where: {
        jobProviderId: jobProviderId,
      },
      include: {
        Contract: {
          select: {
            status: true,
          },
        },
      },
    });
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
});

router.get("/application", middleware_provider, async (req, res) => {
  try {
    //@ts-ignore
    const jobProviderId = req.providerId;
    const jobs = await prisma.job.findMany({
      where: {
        jobProviderId: jobProviderId,
      },
      select: {
        id: true,
      },
    });
    const jobIds = jobs.map((job) => job.id);

    const responses = await prisma.application.findMany({
      where: {
        JobId: {
          in: jobIds,
        },
      },
      include: {
        Job: true,
        Developer: true,
      },
    });
    res.status(200).json(responses);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/postjob", middleware_provider, async (req, res) => {
  const { title, description, requirements, amount } = req.body;
  //@ts-ignore
  const jobProviderId = req.providerId;

  if (!title || !description || !requirements || !amount) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        amount: Number(amount),
        jobProviderId,
      },
    });
    res.status(201).json(newJob);
  } catch (e) {
    console.error("Error creating job:", e);
    res.status(500).json({ message: "Failed to create job" });
  }
});

router.post("/blink", async (req, res) => {
  const { title, description, requirements, amount ,account } = req.body;

  if (!title || !description || !requirements || !amount || !account) {
    return res.status(400).json({ message: "All fields are required" });
  }
  let provider = await prisma.provider.findUnique({
    where: { address: account },
  });

  if (!provider) {
    provider = await prisma.provider.create({
      data: {
        address: account,
      },
    });
  }

  const newJob = await prisma.job.create({
    data: {
      title,
      description,
      requirements,
      amount: Number(amount),
      jobProviderId: provider.id,
    },
  });
  res.json(newJob)
});

router.post("/signin", async (req, res) => {
  const { publicKey, signature } = req.body;
  const message = new TextEncoder().encode("Signing in to upchain(seller)");
  const signatureUint8Array = Uint8Array.from(Buffer.from(signature, "base64"));
  const publicKeyUint8Array = new PublicKey(publicKey).toBytes();
  const result = nacl.sign.detached.verify(
    message,
    signatureUint8Array,
    publicKeyUint8Array
  );

  if (!result) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  const existingUser = await prisma.provider.findFirst({
    where: {
      address: publicKey,
    },
  });
  if (existingUser) {
    const token = jwt.sign(
      {
        providerId: existingUser.id,
      },
      JWT_SECRET
    );
    res.json({ token });
  } else {
    const user = await prisma.provider.create({
      data: {
        address: publicKey,
      },
    });
    const token = jwt.sign(
      {
        providerId: user.id,
      },
      JWT_SECRET
    );
    res.json({ token });
  }
});

export default router;
