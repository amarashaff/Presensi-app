"use client"
import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

type Msg = { role: 'user' | 'assistant'; content: string }
const MODELS = ['qwen-plus','qwen-max','qwen-turbo','qwen-long']

const S: React.CSSProperties = {
  inp: { background:'#1a1a2e', border:'1px solid #2e2e3e', color:'#e2e8f0', borderRadius:12, padding:'10px 14px', fontSize:13, outline:'none', width:'100%' } as any,
}

export default function ChatPage() {
  const [msgs, setMsgs]       = useState<Msg[]>([])
  const [input, setInput]     = useState('')
  const [model, setModel]     = useState('qwen-plus')
  const [sys, setSys]         = useState('Kamu adalah asisten AI yang membantu, akurat, dan ramah.')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  async function send() {
    if (!input.trim() || loading) return
    const newMsgs: Msg[] = [...msgs, { role: 'user', content: input.trim() }]
    setMsgs(newMsgs); setInput(''); setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMsgs, model, systemPrompt: sys }),
      })
      const reader = res.body!.getReader(); const dec = new TextDecoder()
      let text = ''
      setMsgs(prev => [...prev, { role: 'assistant', content: '' }])
      while (true) {
        const { done, value } = await reader.read(); if (done) break
        for (const line of dec.decode(value).split('\n').filter(l => l.startsWith('data: '))) {
          const d = line.slice(6); if (d === '[DONE]') continue
          try { const j = JSON.parse(d); text += j.choices?.[0]?.delta?.content || ''
            setMsgs(prev => { const c=[...prev]; c[c.length-1]={role:'assistant',content:text}; return c })
          } catch {}
        }
      }
    } catch { setMsgs(prev => [...prev, { role:'assistant', content:'❌ Terjadi kesalahan.' }]) }
    setLoading(false)
  }

  return (
    <div className="flex flex-col" style={{ height:'100vh' }}>
      {/* header */}
      <div className="flex items-center justify-between p-3 flex-shrink-0" style={{ borderBottom:'1px solid #1e1e2e' }}>
        <span className="font-semibold text-white text-sm">💬 AI Chat</span>
        <div className="flex gap-2">
          <select value={model} onChange={e=>setModel(e.target.value)} style={{ ...S.inp as any, width:'auto', padding:'5px 10px', fontSize:12 }}>
            {MODELS.map(m=><option key={m}>{m}</option>)}
          </select>
          <button onClick={()=>setMsgs([])} style={{ background:'#1a1a2e', border:'1px solid #2e2e3e', color:'#94a3b8', borderRadius:8, padding:'5px 10px', fontSize:12, cursor:'pointer' }}>🗑️</button>
        </div>
      </div>
      {/* system */}
      <div className="flex items-center gap-2 px-4 py-1.5 flex-shrink-0" style={{ borderBottom:'1px solid #1e1e2e', background:'#0d0d14' }}>
        <span style={{ fontSize:11, color:'#475569', whiteSpace:'nowrap' }}>System:</span>
        <input value={sys} onChange={e=>setSys(e.target.value)} style={{ flex:1, background:'transparent', border:'none', outline:'none', fontSize:11, color:'#64748b' }}/>
      </div>
      {/* messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {msgs.length === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 gap-2" style={{ color:'#475569' }}>
            <span style={{ fontSize:32, opacity:.3 }}>💬</span>
            <p style={{ fontSize:13 }}>Mulai percakapan</p>
          </div>
        )}
        {msgs.map((m,i) => (
          <div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}>
            <div style={{ maxWidth:'80%', padding:'10px 14px', fontSize:13, lineHeight:1.6,
              background: m.role==='user' ? '#4f46e5' : '#1a1a2e',
              color: m.role==='user' ? 'white' : '#e2e8f0',
              borderRadius: m.role==='user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
              border: m.role==='assistant' ? '1px solid #2e2e3e' : 'none' }}>
              {m.role==='assistant'
                ? <ReactMarkdown className="prose prose-invert prose-sm max-w-none">{m.content||(loading?'▌':'')}</ReactMarkdown>
                : m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef}/>
      </div>
      {/* input */}
      <div className="p-3 flex-shrink-0" style={{ borderTop:'1px solid #1e1e2e' }}>
        <div className="flex gap-2 items-end">
          <textarea value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()} }}
            rows={2} placeholder="Ketik pesan... (Enter kirim)"
            style={{ ...S.inp as any, flex:1, resize:'none', lineHeight:1.5 }}/>
          <button onClick={send} disabled={loading||!input.trim()}
            style={{ width:42, height:42, background:'#6366f1', border:'none', borderRadius:12, color:'white', fontSize:16, cursor:'pointer', opacity: loading||!input.trim() ? .4 : 1, flexShrink:0 }}>➤</button>
        </div>
      </div>
    </div>
  )
}
