"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./../config");
const client_1 = require("@prisma/client");
const web3_js_1 = require("@solana/web3.js");
const express_1 = require("express");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("./middleware");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post("/submission", middleware_1.middleware_dev, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contractId, submissionLink } = req.body;
    if (!submissionLink || !contractId) {
        return res
            .status(400)
            .json({ error: "Submission link and contract ID are required." });
    }
    try {
        const submission = yield prisma.contract.update({
            where: {
                id: contractId,
            },
            data: {
                submissonLink: submissionLink,
            },
        });
        res.status(200).json(submission);
    }
    catch (error) {
        console.error("Error updating submission link:", error);
        res.status(500).json({ error: "Failed to update submission link." });
    }
}));
router.get("/contract", middleware_1.middleware_dev, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const developerId = req.devId;
    try {
        const contractInfo = yield prisma.contract.findMany({
            where: {
                DeveloperId: developerId,
            },
            include: {
                Job: true,
            },
        });
        res.status(200).json(contractInfo);
    }
    catch (error) {
        console.error("Error fetching contracts and job details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.post("/application", middleware_1.middleware_dev, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, skills, coverletter, contactInfo, jobId } = req.body;
    //@ts-ignore
    const developerId = req.devId;
    if (!name || !skills || !coverletter || !contactInfo || !jobId) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const job = yield prisma.job.findFirst({
            where: {
                id: Number(jobId),
            },
        });
        if (!job) {
            return res.status(400).json({ message: "Job doesn't exist" });
        }
        const application = yield prisma.application.create({
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
    }
    catch (e) {
        console.error("Error creating application:", e);
    }
}));
router.get("/jobs", middleware_1.middleware_dev, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const developerId = req.devId;
    try {
        const appliedJob = yield prisma.application.findMany({
            where: {
                DeveloperId: developerId,
            },
            select: {
                JobId: true,
            },
        });
        const appliedJobIds = appliedJob.map((application) => application.JobId);
        const jobs = yield prisma.job.findMany({
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
    }
    catch (e) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { publicKey, signature } = req.body;
    const message = new TextEncoder().encode("Signing in to upchain(devs)");
    const signatureUint8Array = Uint8Array.from(Buffer.from(signature, "base64"));
    const publicKeyUint8Array = new web3_js_1.PublicKey(publicKey).toBytes();
    const result = tweetnacl_1.default.sign.detached.verify(message, signatureUint8Array, publicKeyUint8Array);
    if (!result) {
        return res.status(401).json({ message: "Invalid signature" });
    }
    const existingUser = yield prisma.developer.findFirst({
        where: {
            address: publicKey,
        },
    });
    if (existingUser) {
        const token = jsonwebtoken_1.default.sign({
            devId: existingUser.id,
        }, config_1.JWT_SECRET_DEV);
        res.json({ token });
    }
    else {
        const user = yield prisma.developer.create({
            data: {
                address: publicKey,
            },
        });
        const token = jsonwebtoken_1.default.sign({
            devId: user.id,
        }, config_1.JWT_SECRET_DEV);
        res.json({ token });
    }
}));
exports.default = router;
