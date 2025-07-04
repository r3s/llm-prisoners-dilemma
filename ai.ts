import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function getMessage({
  model,
  messages,
}: {
  model: string;
  messages: ChatCompletionMessageParam[];
}) {
  const completion = await openai.chat.completions.create({
    model,
    messages,
  });

  return completion.choices[0].message.content;
}
