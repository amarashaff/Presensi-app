"use client"
import { useState, useRef } from 'react'
const STYLES = [['<auto>','Auto'],['<anime>','Anime'],['<watercolor>','Cat Air'],['<oil painting>','Lukisan'],['<sketch>','Sketsa'],['<3d cartoon>','3D']]
const INP = { background:'#1a1a2e', border:'1px solid #2e2e3e', color:'#e2e8f0', borderRadius:12, padding:'10px 14px', fontSize:13, outline:'none', width:'100%' }

export default function ImageEditPage() {
  const [b64, setB64]       = useState(''); const [url, setUrl] = useState('')
  const [prompt, setPrompt] = useState(''); const [style, setStyle] = useState('<auto>')
  const [result, setResult] = useState(''); const [loading, setLoading] = useState(false); const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function loadFile(f: File) {
    const r = new FileReader(); r.onload = e => { setB64(e.target?.result as string); setUrl('') }; r.readAsDataURL(f)
  }

  async function edit() {
    const src = b64 || url; if (!src || loading) return
    setLoading(true); setError(''); setResult('')
    try {
      const res = await fetch('/api/image/edit', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ sourceImage:src, prompt, style }) })
      const d = await res.json(); if (d.error) { setError(d.error); return }
      setResult(d.imageUrl)
    } catch(e:any) { setError(e.message) }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-lg font-bold text-white mb-4">🎨 Edit Gambar AI</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <div onClick={()=>fileRef.current?.click()}
            style={{ border:'2px dashed #2e2e3e', borderRadius:12, padding:20, textAlign:'center', cursor:'pointer' }}>
            {b64 ? <img src={b64} alt="" style={{ maxHeight:140, margin:'auto', borderRadius:8, objectFit:'contain', width:'100%' }}/>
              : <><div style={{ fontSize:24, marginBottom:6 }}>📁</div><p style={{ fontSize:12, color:'#64748b' }}>Klik untuk upload gambar</p></>}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>e.target.files?.[0]&&loadFile(e.target.files[0])}/>
          <input value={url} onChange={e=>{setUrl(e.target.value);setB64('')}} placeholder="Atau masukkan URL gambar..." style={INP}/>
          <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} rows={3} placeholder="Prompt edit (opsional)..." style={{ ...INP, resize:'none' }}/>
          <div>
            <p style={{ fontSize:12, color:'#94a3b8', marginBottom:6 }}>Gaya Output</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:4 }}>
              {STYLES.map(([v,l])=>(
                <button key={v} onClick={()=>setStyle(v)} style={{ padding:'6px 4px', borderRadius:8, fontSize:11, cursor:'pointer',
                  background: style===v?'#6366f1':'#1a1a2e', color: style===v?'white':'#94a3b8',
                  border: style===v?'1px solid #6366f1':'1px solid #2e2e3e' }}>{l}</button>
              ))}
            </div>
          </div>
          <button onClick={edit} disabled={loading||(!b64&&!url)} style={{ background:'#6366f1', color:'white', border:'none', borderRadius:12, padding:11, fontSize:13, cursor:'pointer', opacity:loading||(!b64&&!url)?.4:1 }}>
            {loading?'⏳ Memproses...':'🎨 Edit Gambar'}
          </button>
          {error && <p style={{ color:'#fca5a5', fontSize:12 }}>❌ {error}</p>}
        </div>
        <div>
          {loading && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:280, border:'1px dashed #2e2e3e', borderRadius:16 }}>
              <div style={{ width:28, height:28, border:'3px solid #334155', borderTopColor:'#6366f1', borderRadius:'50%', animation:'spin .7s linear infinite', marginBottom:10 }}/>
              <p style={{ color:'#64748b', fontSize:13 }}>Memproses gambar...</p>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}
          {result && (
            <div>
              <img src={result} alt="Edited" style={{ width:'100%', borderRadius:12, border:'1px solid #2e2e3e' }}/>
              <a href={result} download="edited.png" target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginTop:10, padding:10, background:'#059669', color:'white', borderRadius:10, fontSize:13, textDecoration:'none' }}>⬇️ Download Hasil</a>
            </div>
          )}
          {!loading && !result && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:280, border:'1px dashed #2e2e3e', borderRadius:16, color:'#475569' }}>
              <span style={{ fontSize:32, opacity:.3 }}>🎨</span><p style={{ fontSize:13, marginTop:8 }}>Hasil akan muncul di sini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
