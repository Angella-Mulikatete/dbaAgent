import { inngest } from "@/inngest/client";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { userInput } = await req.json();
    console.log("Received user input:", userInput);

    const resultIds = await inngest.send({
      name: "test/dba.agent",
      data: {
        question: userInput,
      },
    });
    const runId = resultIds.ids[0];
    console.log("Inngest event sent, runId:", runId);

    let runStatus;
    while(true){
      const runs = await getRuns(runId);
      console.log("runs in the API ", runs)

      if (!runs || !Array.isArray(runs) || runs.length === 0) {
        throw new Error(`No runs found for runId ${runId}`);
      }

      runStatus = runs[0].status;
      console.log(`Run ${runId} status:`, runStatus);
      if (runStatus === 'completed' || runStatus === 'failed') {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
    }
    return NextResponse.json(runStatus);
  } catch (error) {
    console.error("Error in /api/ai-db-agent:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function getRuns(runId: string){
    const inngestSigningKey = process.env.INNGEST_SIGNING_KEY;

    if (!inngestSigningKey) {
      console.error("INNGEST_SIGNING_KEY is not set in environment variables.");
      throw new Error("Inngest signing key is missing.");
    }

    try {
      const result = await axios.get(`http://127.0.0.1:8288/v1/events/${runId}/runs`, {
          headers: {
              'Authorization': `Bearer ${inngestSigningKey}`,
              'Content-Type': 'application/json',
          }
      });
      console.log("Result from the api", result)
      return result.data;
    } catch (error) {
      console.error(`Error fetching run status for ${runId}:`, error);
      throw error;
    }
}
