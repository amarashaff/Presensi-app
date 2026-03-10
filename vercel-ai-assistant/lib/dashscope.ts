const BASE = process.env.DASHSCOPE_BASE_URL || 'https://dashscope-intl.aliyuncs.com'
const KEY  = process.env.DASHSCOPE_API_KEY  || ''

export const OPENAI_BASE = `${BASE}/compatible-mode/v1`
export const DS_BASE     = `${BASE}/api/v1`

export function authHeaders(async_mode = false): Record<string,string> {
  const h: Record<string,string> = {
    'Authorization': `Bearer ${KEY}`,
    'Content-Type': 'application/json',
  }
  if (async_mode) h['X-DashScope-Async'] = 'enable'
  return h
}

export async function dsGet(path: string) {
  const r = await fetch(`${DS_BASE}${path}`, { headers: { 'Authorization': `Bearer ${KEY}` } })
  return r.json()
}

export async function dsPost(path: string, body: object, async_mode = false) {
  const r = await fetch(`${DS_BASE}${path}`, {
    method: 'POST',
    headers: authHeaders(async_mode),
    body: JSON.stringify(body),
  })
  return r.json()
}
