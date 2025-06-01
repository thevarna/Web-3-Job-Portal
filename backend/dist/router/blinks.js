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
const express_1 = __importDefault(require("express"));
const web3_js_1 = require("@solana/web3.js");
const actions_1 = require("@solana/actions");
const client_1 = require("@prisma/client");
const config_1 = require("../config");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
const headers = (0, actions_1.createActionHeaders)();
const PAYMENT_AMOUNT_SOL = 1;
const DEFAULT_SOL_ADDRESS = "94A7ExXa9AkdiAnPiCYwJ8SbMuZdAoXnAhGiJqygmFfL";
const connection = new web3_js_1.Connection(process.env.RPC_URL || (0, web3_js_1.clusterApiUrl)("devnet"));
router.use((0, actions_1.actionCorsMiddleware)({}));
router.get("/actions/transfer-sol", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const baseHref = new URL(`/v1/blinks/actions/transfer-sol`, req.protocol + "://" + req.get("host")).toString();
        const payload = {
            title: "JOBLINK",
            icon: `data:image/png;base64,${config_1.BASE64_IMG}`,
            description: "Pay 0.1 SOL to post a job on Upchain",
            label: "Pay and Post Job",
            links: {
                actions: [
                    {
                        label: "Create Job",
                        href: `${baseHref}?amount=${PAYMENT_AMOUNT_SOL}&to=${DEFAULT_SOL_ADDRESS}`,
                        parameters: [
                            {
                                name: "title",
                                label: "Enter the title for the Job",
                                required: true,
                            },
                            {
                                name: "description",
                                label: "Enter the job description",
                                required: true,
                            },
                            {
                                name: "requirements",
                                label: "Enter job requirements",
                                required: true,
                            },
                            {
                                name: "amount",
                                label: "Enter the payment amount (in SOL)",
                                required: true,
                            },
                        ],
                    },
                ],
            },
        };
        res.set(headers);
        res.json(payload);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "An unknown error occurred" });
    }
}));
router.post("/actions/transfer-sol", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { account, data } = req.body;
        const { title, description, requirements, amount } = data;
        if (!account || !title || !description || !requirements || !amount) {
            throw new Error("Missing required parameters");
        }
        const user = new web3_js_1.PublicKey(account);
        const ix = web3_js_1.SystemProgram.transfer({
            fromPubkey: user,
            toPubkey: new web3_js_1.PublicKey(DEFAULT_SOL_ADDRESS),
            lamports: Number(amount) * web3_js_1.LAMPORTS_PER_SOL,
        });
        const tx = new web3_js_1.Transaction();
        tx.add(ix);
        tx.feePayer = user;
        tx.recentBlockhash = (yield connection.getLatestBlockhash({ commitment: "finalized" })).blockhash;
        const serializedTransaction = tx
            .serialize({
            requireAllSignatures: false,
            verifySignatures: false,
        })
            .toString("base64");
        let provider = yield prisma.provider.findUnique({
            where: { address: account },
        });
        if (!provider) {
            provider = yield prisma.provider.create({
                data: {
                    address: account,
                },
            });
        }
        const newJob = yield prisma.job.create({
            data: {
                title,
                description,
                requirements,
                amount: Number(amount),
                jobProviderId: provider.id,
            },
        });
        const payload = yield (0, actions_1.createPostResponse)({
            fields: {
                transaction: tx,
                message: "Job posted successfully. Please go to https://upchain-delta.vercel.app/ to view job responses(NOTE: Login with the same wallet used for job creation)",
            },
        });
        res.set(headers);
        res.json(payload);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "An unknown error occurred" });
    }
}));
router.options("/actions/transfer-sol", (req, res) => {
    res.set(headers);
    res.sendStatus(204);
});
exports.default = router;
