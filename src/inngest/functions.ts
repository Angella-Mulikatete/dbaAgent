/* eslint-disable @typescript-eslint/no-unused-vars */
import { inngest } from "./client";
import { createAgent, gemini } from '@inngest/agent-kit';

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);


export const dbaAgent = createAgent({
  name: 'Database administrator',
  description: 'Provides expert support for managing PostgreSQL databases',
  system:
    'You are a PostgreSQL expert database administrator. ' +
    'You only provide answers to questions related to PostgreSQL database schema, indexes, and extensions.',
  model: gemini({
    model: 'gemini-2.0-flash',
    apiKey: 'AIzaSyCCbHxYHatc8c6jNWvwW3EBxsy47YUXh24',
    // defaultParameters: {
    //   max_tokens: 1000,
    // },
  }),
});

export const dbaAgentFunction = inngest.createFunction(
  { id: "dba-agent" },
  { event: "test/dba.agent" },
    async ({ event, step }) => {
        const { question } = event.data;
        const response = await dbaAgent.run(question);
        console.log("The response in the dbaAgentFunction in Function.ts", response)
        return response;
    }
)