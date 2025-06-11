import { inngest } from "@/inngest/client";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  const { userInput } = await req.json();

  const resultIds = await inngest.send({
    name: "dba-agent",
    data: {
      question: userInput,
    },
  });
  const runId = resultIds.ids[0];
  let runStatus;
  while(true){
    const runs = await getRuns(runId);
    runStatus = runs[0].status;
    if (runStatus === 'completed' || runStatus === 'failed') {
      break;
    }
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
  }
  return NextResponse.json(runStatus)

}

async function getRuns(runId: string){
    const result = await axios.get(`http://127.0.0.1:8288/v1/events/${runId}/runs`, {
        headers: {
            'Authorization': `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
            'Content-Type': 'application/json',
        }
    })

    return result.data;
}
