import { NextRequest, NextResponse } from 'next/server'

export const runtime  = 'nodejs'
export const maxDuration = 60

const BASE = process.env.DASHSCOPE_BASE_URL || 'https://dashscope-intl.aliyuncs.com'
const KEY  = process.env.DASHSCOPE_API_KEY  || ''

export async function POST(req: NextRequest) {
  const { mode, prompt, negative_prompt, resolution, base64 } = await req.json()
  const model  = mode === 'i2v' ? 'wan2.1-i2v-turbo' : 'wan2.1-t2v-turbo'
  const path   = mode === 'i2v' ? '/api/v1/services/aigc/image2video/video-synthesis/' : '/api/v1/services/aigc/video-generation/generation'
  const input  = { prompt, ...(negative_prompt && { negative_prompt }), ...(mode === 'i2v' && base64 && { image: base64 }) }
  try {
    const r = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', 'X-DashScope-Async': 'enable' },
      body: JSON.stringify({ model, input, parameters: { resolution } })
    }).then(r => r.json())
    if (!r.output?.task_id) throw new Error(r.message || JSON.stringify(r))
    return NextResponse.json({ taskId: r.output.task_id })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
