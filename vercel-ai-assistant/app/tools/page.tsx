"use client"
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

const TOOLS = [
  { id:'summarize', label:'📝 Ringkasan',      p:(t:string)=>`Ringkasan padat dari teks berikut:\n\n${t}` },
  { id:'grammar',   label:'✅ Tata Bahasa',     p:(t:string)=>`Perbaiki tata bahasa dan ejaan teks berikut, tampilkan hasil + penjelasan:\n\n${t}` },
  { id:'creative',  label:'✨ Penulisan Kreatif',p:(t:string)=>`Kembangkan menjadi tulisan kreatif yang menarik:\n\n${t}` },
  { id:'code',      label:'💻 Generator Kode',  p:(t:string)=>`Buat kode bersih dan fungsional + penjelasan:\n\n${t}` },
  { id:'explain',   label:'🔍 Jelaskan',        p:(t:string)=>`Jelaskan dengan bahasa mudah + contoh:\n\n${t}` },
  { id:'email',     label:'📧 Tulis Email',     p:(t:string)=>`Tulis email profesional berdasarkan deskripsi ini:\n\n${t}` },
  { id:'bullet',    label:'📌 Poin-poin',       p:(t:string)=>`Ubah teks menjadi poin-poin terstruktur:\n\n${t}` },
  { id:'seo',       label:'🚀 Artikel SEO',     p:(t:string)=>`Tulis artikel SEO menarik berdasarkan topik:\n\n${t}` },
  { id:'qa',        label:'❓ Q&A',             p:(t:string)=>`Buat Q&A komprehensif berdasarkan teks berikut:\n\n${t}` },
]

const INP_STYLE = { background:'#1a1a2e', border:'1px solid #2e2e3e', color:'#e2e8f0', borderRadius:12, padding:'10px 14px', fontSize:13, outline:'none', width:'100%' }

export default function ToolsPage() {
  const [tool, setTool]     = useState(TOOLS[0])
  const [input, setInput]   = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  async function run() {
    if (!input.trim() || loading) return
    setLoading(true); setOutput('')
    try {
      const res = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ messages:[{role:'user',content:tool.p(input)}], model:'qwen-plus', systemPrompt:'Kamu adalah asisten penulisan profesional.' }) })
      const reader = res.body!.getReader(); const dec = new TextDecoder(); let text = ''
      while (true) {
        const {done,value} = await reader.read(); if (done) break
        for (const line of dec.decode(value).split('\n').filter(l=>l.startsWith('data: '))) {
          const d=line.slice(6); if(d==='[DONE]') continue
          try { const j=JSON.parse(d); text+=j.choices?.[0]?.delta?.content||''; setOutput(text) } catch {}
        }
      }
    } catch { setOutput('❌ Terjadi kesalahan.') }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-4" style={{ minHeight:'100vh' }}>
      <div>
        <h2 className="text-lg font-bold text-white mb-1">✍️ Alat Teks AI</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {TOOLS.map(t => (
            <button key={t.id} onClick={()=>setTool(t)}
              style={{ padding:'6px 12px', borderRadius:8, fontSize:11, fontWeight:500, cursor:'pointer', transition:'all .15s',
                background: tool.id===t.id ? '#6366f1' : '#1a1a2e', color: tool.id===t.id ? 'white' : '#94a3b8',
                border: tool.id===t.id ? '1px solid #6366f1' : '1px solid #2e2e3e' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col gap-3">
          <textarea value={input} onChange={e=>setInput(e.target.value)} rows={12}
            placeholder="Masukkan teks di sini..." style={{ ...INP_STYLE, resize:'none', lineHeight:1.6 }}/>
          <button onClick={run} disabled={loading||!input.trim()}
            style={{ background:'#6366f1', color:'white', border:'none', borderRadius:12, padding:'10px', fontSize:13, cursor:'pointer', opacity:loading||!input.trim()?.4:1 }}>
            {loading ? '⏳ Memproses...' : '⚡ Jalankan'}
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span style={{ fontSize:12, color:'#94a3b8' }}>Output</span>
            <button onClick={()=>navigator.clipboard.writeText(output)} style={{ background:'#1a1a2e', border:'1px solid #2e2e3e', color:'#94a3b8', borderRadius:8, padding:'4px 10px', fontSize:11, cursor:'pointer' }}>📋 Salin</button>
          </div>
          <div style={{ ...INP_STYLE, flex:1, minHeight:300, overflowY:'auto', lineHeight:1.6 }}>
            {output ? <ReactMarkdown className="prose prose-invert prose-sm max-w-none">{output}</ReactMarkdown>
              : <span style={{ color:'#475569', fontStyle:'italic' }}>Hasil akan muncul di sini...</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
