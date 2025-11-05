// lib/env.ts
import { z } from "zod";

const Env = z.object({
  TICKETMASTER_API_KEY: z.string().min(1),
  TOGETHER_API_KEY: z.string().min(1),
  EVENTBRITE_API_KEY: z.string().min(1),
  DISCORD_WEBHOOK_URL: z.string().optional(),
  GITHUB_WEBHOOK_SECRET: z.string().optional(),
});

const parsed = Env.parse({
  TICKETMASTER_API_KEY: process.env.TICKETMASTER_API_KEY,
  TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
  EVENTBRITE_API_KEY: process.env.EVENTBRITE_API_KEY,
  DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL,
  GITHUB_WEBHOOK_SECRET: process.env.GITHUB_WEBHOOK_SECRET,
});

export const env = parsed;
