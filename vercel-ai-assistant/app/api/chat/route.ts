import { NextRequest } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'nodejs'
export const maxDuration = 60

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: `${process.env.DASHSCOPE_BASE_URL || 'https://dashscope-intl.aliyuncs.com'}/compatible-mode/v1`,
})

export async function POST(req: NextRequest) {
  const { messages, model = 'qwen-plus', systemPrompt } = await req.json()
  const stream = await client.chat.completions.create({
    model,
    messages: [{ role: 'system', content: systemPrompt || 'Kamu adalah asisten AI yang membantu.' }, ...messages],
    stream: true,
  })
  const enc = new TextEncoder()
  const readable = new ReadableStream({
    async start(ctrl) {
      try {
        for await (const chunk of stream) {
          ctrl.enqueue(enc.encode(`data: ${JSON.stringify(chunk)}\n\n`))
        }
        ctrl.enqueue(enc.encode('data: [DONE]\n\n'))
      } finally { ctrl.close() }
    },
  })
  return new Response(readable, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } })
}
