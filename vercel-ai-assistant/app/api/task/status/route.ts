import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const BASE = process.env.DASHSCOPE_BASE_URL || 'https://dashscope-intl.aliyuncs.com'
const KEY  = process.env.DASHSCOPE_API_KEY  || ''

export async function GET(req: NextRequest) {
  const taskId = req.nextUrl.searchParams.get('taskId')
  if (!taskId) return NextResponse.json({ error: 'taskId diperlukan' }, { status: 400 })
  const data = await fetch(`${BASE}/api/v1/tasks/${taskId}`, { headers: { Authorization: `Bearer ${KEY}` } }).then(r => r.json())
  return NextResponse.json({
    status:   data.output?.task_status || 'UNKNOWN',
    videoUrl: data.output?.video_url   || data.output?.results?.video_url || null,
    message:  data.output?.message     || null,
  })
}
