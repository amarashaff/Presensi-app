"use client"
import { useState } from 'react'
const STYLES = [['<auto>','Auto'],['<photography>','Foto'],['<portrait photo>','Potret'],['<anime>','Anime'],['<3d cartoon>','3D'],['<watercolor>','Cat Air'],['<oil painting>','Lukisan'],['<sketch>','Sketsa'],['<flat illustration>','Flat']]
const INP = { background:'#1a1a2e', border:'1px solid #2e2e3e', color:'#e2e8f0', borderRadius:12, padding:'10px 14px', fontSize:13, outline:'none', width:'100%' }

export default function ImagePage() {
  const [prompt, setPrompt] = useState(''); const [neg, setNeg] = useState('blurry, ugly, distorted, low quality, watermark')
  const [style, setStyle]   = useState('<auto>'); const [size, setSize] = useState('1024*1024'); const [n, setN] = useState(1)
  const [images, setImages] = useState<string[]>([]); const [loading, setLoading] = useState(false); const [error, setError] = useState('')

  async function gen() {
    if (!prompt.trim()||loading) return
    setLoading(true); setError(''); setImages([])
    try {
      const res = await fetch('/api/image/generate', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ prompt, negative_prompt:neg, style, size, n }) })
      const d = await res.json()
      if (d.error) { setError(d.error); return }
      setImages(d.images||[])
    } catch(e:any) { setError(e.message) }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-lg font-bold text-white mb-4">✨ Generate Gambar AI</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="flex flex-col gap-3 lg:col-span-1">
          <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} rows={5} placeholder="Deskripsikan gambar yang ingin dibuat..." style={{ ...INP, resize:'none' }}/>
          <input value={neg} onChange={e=>setNeg(e.target.value)} placeholder="Negative prompt" style={INP}/>
          <div>
            <p style={{ fontSize:12, color:'#94a3b8', marginBottom:6 }}>Gaya Seni</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:4 }}>
              {STYLES.map(([v,l])=>(
                <button key={v} onClick={()=>setStyle(v)} style={{ padding:'6px 4px', borderRadius:8, fontSize:11, cursor:'pointer',
                  background: style===v ? '#6366f1' : '#1a1a2e', color: style===v ? 'white' : '#94a3b8',
                  border: style===v ? '1px solid #6366f1' : '1px solid #2e2e3e' }}>{l}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p style={{ fontSize:11, color:'#94a3b8', marginBottom:4 }}>Ukuran</p>
              <select value={size} onChange={e=>setSize(e.target.value)} style={{ ...INP, fontSize:12 }}>
                {['1024*1024','720*1280','1280*720','768*512','512*768'].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <p style={{ fontSize:11, color:'#94a3b8', marginBottom:4 }}>Jumlah</p>
              <input type="number" min={1} max={4} value={n} onChange={e=>setN(+e.target.value)} style={{ ...INP, fontSize:12 }}/>
            </div>
          </div>
          <button onClick={gen} disabled={loading||!prompt.trim()} style={{ background:'#6366f1', color:'white', border:'none', borderRadius:12, padding:11, fontSize:13, cursor:'pointer', opacity:loading||!prompt.trim()?.4:1 }}>
            {loading?'⏳ Membuat... (30–90 detik)':'✨ Generate Gambar'}
          </button>
          {error && <p style={{ color:'#fca5a5', fontSize:12 }}>❌ {error}</p>}
        </div>
        <div className="lg:col-span-2">
          {!loading && images.length===0 && !error && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:300, border:'1px dashed #2e2e3e', borderRadius:16, color:'#475569' }}>
              <span style={{ fontSize:32, opacity:.3 }}>🖼️</span><p style={{ fontSize:13, marginTop:8 }}>Gambar akan muncul di sini</p>
            </div>
          )}
          {loading && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:300, border:'1px dashed #2e2e3e', borderRadius:16 }}>
              <div style={{ width:32, height:32, border:'3px solid #334155', borderTopColor:'#6366f1', borderRadius:'50%', animation:'spin .7s linear infinite', marginBottom:12 }}/>
              <p style={{ color:'#64748b', fontSize:13 }}>Membuat gambar...</p>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}
          {images.length>0 && (
            <div style={{ display:'grid', gridTemplateColumns: images.length>1 ? '1fr 1fr' : '1fr', gap:10 }}>
              {images.map((url,i)=>(
                <div key={i} className="group" style={{ position:'relative', borderRadius:12, overflow:'hidden', border:'1px solid #2e2e3e' }}>
                  <img src={url} alt="" style={{ width:'100%', height:'auto', display:'block' }}/>
                  <a href={url} download={`img-${i+1}.png`} target="_blank" rel="noopener noreferrer"
                    style={{ position:'absolute', bottom:8, right:8, background:'rgba(0,0,0,.7)', color:'white', padding:'5px 10px', borderRadius:8, fontSize:12, textDecoration:'none' }}>⬇️</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
