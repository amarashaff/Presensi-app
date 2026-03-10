import { NextRequest, NextResponse } from 'next/server'

export const runtime  = 'nodejs'
export const maxDuration = 60

const BASE = process.env.DASHSCOPE_BASE_URL || 'https://dashscope-intl.aliyuncs.com'
const KEY  = process.env.DASHSCOPE_API_KEY  || ''

export async function POST(req: NextRequest) {
  const { sourceImage, prompt, style } = await req.json()
  try {
    const t = await fetch(`${BASE}/api/v1/services/aigc/image2image/image-synthesis/`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', 'X-DashScope-Async': 'enable' },
      body: JSON.stringify({ model: 'wanx-image-repaint', input: { base_image_url: sourceImage, ...(prompt && { prompt }) }, parameters: { style, seed: Math.floor(Math.random()*9999999) } })
    }).then(r => r.json())
    if (!t.output?.task_id) throw new Error(t.message || JSON.stringify(t))
    let result = null
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 3000))
      const p = await fetch(`${BASE}/api/v1/tasks/${t.output.task_id}`, { headers: { Authorization: `Bearer ${KEY}` } }).then(r => r.json())
      if (p.output?.task_status === 'SUCCEEDED') { result = p; break }
      if (p.output?.task_status === 'FAILED')    throw new Error(p.output.message || 'Edit gagal')
    }
    if (!result) throw new Error('Timeout.')
    return NextResponse.json({ imageUrl: result.output.results?.[0]?.url })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
