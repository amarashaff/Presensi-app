import { NextRequest, NextResponse } from 'next/server'

export const runtime  = 'nodejs'
export const maxDuration = 60

const BASE = process.env.DASHSCOPE_BASE_URL || 'https://dashscope-intl.aliyuncs.com'
const KEY  = process.env.DASHSCOPE_API_KEY  || ''

async function poll(taskId: string) {
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 3000))
    const p = await fetch(`${BASE}/api/v1/tasks/${taskId}`, { headers: { Authorization: `Bearer ${KEY}` } }).then(r => r.json())
    if (p.output?.task_status === 'SUCCEEDED') return p
    if (p.output?.task_status === 'FAILED')    throw new Error(p.output.message || 'Task gagal')
  }
  throw new Error('Timeout. Coba lagi.')
}

export async function POST(req: NextRequest) {
  const { prompt, negative_prompt, style, size, n = 1 } = await req.json()
  try {
    const t = await fetch(`${BASE}/api/v1/services/aigc/text2image/image-synthesis/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', 'X-DashScope-Async': 'enable' },
      body: JSON.stringify({ model: 'wanx-v1', input: { prompt, negative_prompt }, parameters: { style, size, n, seed: Math.floor(Math.random()*9999999) } })
    }).then(r => r.json())
    if (!t.output?.task_id) throw new Error(t.message || JSON.stringify(t))
    const result = await poll(t.output.task_id)
    return NextResponse.json({ images: result.output.results.map((r: any) => r.url) })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
