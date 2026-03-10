"use client"
import { useState } from 'react'
const LANGS = ['Indonesia','English','Mandarin','Japanese','Korean','Arabic','French','German','Spanish','Portuguese','Russian','Hindi','Thai','Vietnamese','Malay','Italian','Dutch','Turkish','Polish','Swedish']
const INP = { background:'#1a1a2e', border:'1px solid #2e2e3e', color:'#e2e8f0', borderRadius:12, padding:'10px 14px', fontSize:13, outline:'none', width:'100%' }

export default function TranslatePage() {
  const [from, setFrom] = useState('Indonesia'); const [to, setTo] = useState('English')
  const [input, setInput] = useState(''); const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  async function run() {
    if (!input.trim()||loading) return
    setLoading(true); setOutput('')
    const prompt = `Terjemahkan dari ${from} ke ${to}. Hanya teks terjemahan saja:\n\n${input}`
    try {
      const res = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ messages:[{role:'user',content:prompt}], model:'qwen-plus', systemPrompt:'Kamu adalah penerjemah profesional.' }) })
      const reader = res.body!.getReader(); const dec = new TextDecoder(); let text=''
      while (true) {
        const {done,value}=await reader.read(); if(done) break
        for (const line of dec.decode(value).split('\n').filter(l=>l.startsWith('data: '))) {
          const d=line.slice(6); if(d==='[DONE]') continue
          try { const j=JSON.parse(d); text+=j.choices?.[0]?.delta?.content||''; setOutput(text) } catch {}
        }
      }
    } finally { setLoading(false) }
  }

  function swap() { const tl=from; setFrom(to); setTo(tl); const tt=input; setInput(output); setOutput(tt) }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-lg font-bold text-white mb-4">🌐 Terjemahan AI</h2>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <select value={from} onChange={e=>setFrom(e.target.value)} style={{ ...INP, width:'auto' }}>{LANGS.map(l=><option key={l}>{l}</option>)}</select>
        <button onClick={swap} style={{ background:'#1a1a2e', border:'1px solid #2e2e3e', color:'#94a3b8', borderRadius:8, padding:'8px 12px', cursor:'pointer' }}>⇄</button>
        <select value={to} onChange={e=>setTo(e.target.value)} style={{ ...INP, width:'auto' }}>{LANGS.map(l=><option key={l}>{l}</option>)}</select>
        <button onClick={run} disabled={loading||!input.trim()} style={{ background:'#6366f1', color:'white', border:'none', borderRadius:10, padding:'9px 18px', fontSize:13, cursor:'pointer', opacity:loading||!input.trim()?.4:1 }}>
          {loading?'⏳ Menerjemahkan...':'🌐 Terjemahkan'}
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <textarea value={input} onChange={e=>setInput(e.target.value)} rows={14} placeholder="Teks yang ingin diterjemahkan..." style={{ ...INP, resize:'none' }}/>
        <div style={{ position:'relative' }}>
          <textarea value={output} readOnly rows={14} placeholder="Hasil terjemahan..." style={{ ...INP, resize:'none' }}/>
          <button onClick={()=>navigator.clipboard.writeText(output)} style={{ position:'absolute', top:10, right:10, background:'#1a1a2e', border:'1px solid #2e2e3e', color:'#94a3b8', borderRadius:8, padding:'4px 8px', fontSize:11, cursor:'pointer' }}>📋</button>
        </div>
      </div>
    </div>
  )
}
