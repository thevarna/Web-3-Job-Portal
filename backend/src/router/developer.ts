import { JWT_SECRET_DEV } from "./../config";
import { PrismaClient } from "@prisma/client";
import { PublicKey } from "@solana/web3.js";
import { Router } from "express";
import nacl from "tweetnacl";
import jwt from "jsonwebtoken";
import { middleware_dev } from "./middleware";

const router = Router();
const prisma = new PrismaClient();

router.post("/submission", middleware_dev, async (req, res) => {
  const { contractId, submissionLink } = req.body;
  if (!submissionLink || !contractId) {
    return res
      .status(400)
      .json({ error: "Submission link and contract ID are required." });
  }
  try {
    const submission = await prisma.contract.update({
      where: {
        id: contractId,
      },
      data: {
        submissonLink: submissionLink,
      },
    });
    res.status(200).json(submission);
  } catch (error) {
    console.error("Error updating submission link:", error);
    res.status(500).json({ error: "Failed to update submission link." });
  }
});

router.get("/contract", middleware_dev, async (req, res) => {
  //@ts-ignore
  const developerId = req.devId;
  try {
    const contractInfo = await prisma.contract.findMany({
      where: {
        DeveloperId: developerId,
      },
      include: {
        Job: true,
      },
    });
    res.status(200).json(contractInfo);
  } catch (error) {
    console.error("Error fetching contracts and job details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/application", middleware_dev, async (req, res) => {
  const { name, skills, coverletter, contactInfo, jobId } = req.body;
  //@ts-ignore
  const developerId = req.devId;

  if (!name || !skills || !coverletter || !contactInfo || !jobId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const job = await prisma.job.findFirst({
      where: {
        id: Number(jobId),
      },
    });

    if (!job) {
      return res.status(400).json({ message: "Job doesn't exist" });
    }

    const application = await prisma.application.create({
      data: {
        name: name,
        Skills: skills,
        coverLetter: coverletter,
        contactInforamtion: contactInfo,
        JobId: parseInt(jobId, 10),
        dateApplied: new Date(),
        DeveloperId: developerId,
      },
    });

    res
      .status(201)
      .json({ message: "Application submitted successfully", application });
  } catch (e: any) {
    console.error("Error creating application:", e);
  }
});

router.get("/jobs", middleware_dev, async (req, res) => {
  //@ts-ignore
  const developerId = req.devId;
  try {
    const appliedJob = await prisma.application.findMany({
      where: {
        DeveloperId: developerId,
      },
      select: {
        JobId: true,
      },
    });
    const appliedJobIds = appliedJob.map((application) => application.JobId);

    const jobs = await prisma.job.findMany({
      where: {
        id: {
          notIn: appliedJobIds,
        },
      },

      include: {
        JobProvider: true,
      },
    });
    res.status(200).json(jobs);
  } catch (e) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signin", async (req, res) => {
  const { publicKey, signature } = req.body;
  const message = new TextEncoder().encode("Signing in to upchain(devs)");
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

  const existingUser = await prisma.developer.findFirst({
    where: {
      address: publicKey,
    },
  });
  if (existingUser) {
    const token = jwt.sign(
      {
        devId: existingUser.id,
      },
      JWT_SECRET_DEV
    );
    res.json({ token });
  } else {
    const user = await prisma.developer.create({
      data: {
        address: publicKey,
      },
    });
    const token = jwt.sign(
      {
        devId: user.id,
      },
      JWT_SECRET_DEV
    );
    res.json({ token });
  }
});

export default router;
