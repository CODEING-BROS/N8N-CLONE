import { inngest } from "./client";
import prisma from "@/lib/db";

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';


const google = createGoogleGenerativeAI();
const openai = createOpenAI();
const anthropic = createAnthropic();

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {

    await step.sleep("pretend-we-are-doing-something-expensive", 5000);

    const { steps : geminiSteps } = await step.ai.wrap("gemini-generate-text", 
      generateText, {
        system: "You are a helpful assistant for generating text.",
        model: google('gemini-2.5-flash'),
        prompt: 'What is 2 + 2?',
      }
    );

    const { steps : openaiSteps } = await step.ai.wrap("openai-generate-text", 
      generateText, {
        system: "You are a helpful assistant for generating text.",
        model: openai('gpt-4'),
        prompt: 'What is 2 + 2?',
      }
    );

    const { steps : anthropicSteps } = await step.ai.wrap("anthropic-generate-text", 
      generateText, {
        system: "You are a helpful assistant for generating text.",
        model: anthropic('claude-sonnet-4-5'),
        prompt: 'What is 2 + 2?',
      }
    );

    return {
      geminiSteps,
      openaiSteps,
      anthropicSteps,
    }
  },
);