import { NextResponse } from "next/server";
import axios from "axios";
import { BACKEND_URL } from "@/utils";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { title, description, requirements, amount, account } = body;
    if (!title || !description || !requirements || !amount || !account) {
      return new Response(
        "Missing required fields: title, description, requirements, amount, or account",
        {
          status: 400,
        }
      );
    }

    await axios.post(`${BACKEND_URL}/blink`, {
      title,
      description,
      requirements,
      amount,
      account,
    });

    return new NextResponse(JSON.stringify({ message: "Job posted successfully." }), {
      status: 200,
    });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "An unknown error occurred";
    return new Response(message, {
      status: 400,
    });
  }
};

