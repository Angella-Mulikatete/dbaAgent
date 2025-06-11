/* eslint-disable @typescript-eslint/no-unused-vars */
import { inngest } from "./client";
import { createAgent, anthropic } from '@inngest/agent-kit';

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
  model: anthropic({
    model: 'gemini-2.5-flash-preview-04-17',
    apiKey: process.env.GEMINI_API_KEY,
    defaultParameters: {
      max_tokens: 1000,
    },
  }),
});

export const dbaAgentFunction = inngest.createFunction(
  { id: "dba-agent" },
  { event: "test/dba.agent" },
    async ({ event, step }) => {
        const { question } = event.data;
        const response = await dbaAgent.run(question);
        return response;
    }
)