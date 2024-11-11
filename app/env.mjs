// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
// env.mjs : VALIDATES REQUIRED ENVIRONMENT VARIABLES FOR AI
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

import { z } from 'zod';

// Define server-side environment variables schema
const server = z.object({
  OPENAI_API_KEY: z.string().nonempty('OPENAI_API_KEY is required'),
//   NODE_ENV: z.enum(['development', 'test', 'production']).optional(),
});

// Extract environment variables
const processEnv = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
//   NODE_ENV: process.env.NODE_ENV,
};

// Validate environment variables
const parsedEnv = server.safeParse(processEnv);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.flatten().fieldErrors);
  throw new Error('Invalid environment variables for Chatbox component');
}

// Export the validated environment variables
export const env = parsedEnv.data;
