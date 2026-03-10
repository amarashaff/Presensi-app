"use client"
import { useState, useRef, useEffect } from 'react'

const INP = { background:'#1a1a2e', border:'1px solid #2e2e3e', color:'#e2e8f0', borderRadius:12, padding:'10px 14px', fontSize:13, outline:'none', width:'100%' }

export default function VideoPage() {
  const [mode, setMode]     = useState<'t2v'|'i2v'>('t2v')
  const [prompt, setPrompt] = useState(''); const [neg, setNeg] = useState('blurry, distorted, low quality')
  const [res, setRes]       = useState('480p'); const [b64, setB64] = useState('')
  const [taskId, setTaskId] = useState(''); const [status, setStatus] = useState<'idle'|'loading'|'done'|'fail'>('idle')
  const [videoUrl, setVUrl] = useState(''); const [error, setError] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<any>(null); const pollRef = useRef<any>(null)
  const fileRef  = useRef<HTMLInputElement>(null)

  useEffect(()=>()=>{clearInterval(timerRef.current);clearInterval(pollRef.current)},[])

  function loadImg(f:File){const r=new FileReader();r.onload=e=>setB64(e.target?.result as string);r.readAsDataURL(f)}

  async function generate() {
    if (!prompt.trim()||(mode==='i2v'&&!b64)||status==='loading') return
    setStatus('loading'); setError(''); setVUrl(''); setElapsed(0)
    timerRef.current = setInterval(()=>setElapsed(p=>p+1),1000)
    try {
      const r = await fetch('/api/video/generate', { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ mode, prompt, negative_prompt:neg, resolution:res, base64:b64 }) })
      const d = await r.json(); if (d.error) throw new Error(d.error)
      setTaskId(d.taskId)
      pollRef.current = setInterval(async()=>{
        const pr = await fetch(`/api/task/status?taskId=${d.taskId}`).then(r=>r.json())
        if (pr.status==='SUCCEEDED') {
          clearInterval(pollRef.current); clearInterval(timerRef.current)
          setStatus('done'); setVUrl(pr.videoUrl)
        } else if (pr.status==='FAILED') {
          clearInterval(pollRef.current); clearInterval(timerRef.current)
          setStatus('fail'); setError(pr.message||'Video gagal')
        }
      }, 8000)
    } catch(e:any) {
      clearInterval(timerRef.current); setStatus('fail'); setError(e.message)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-lg font-bold text-white mb-4">🎬 Generate Video AI</h2>
      <div className="flex gap-2 mb-5">
        {(['t2v','i2v'] as const).map(m=>(
          <button key={m} onClick={()=>setMode(m)} style={{ padding:'7px 14px', borderRadius:8, fontSize:12, cursor:'pointer',
            background: mode===m?'#6366f1':'#1a1a2e', color: mode===m?'white':'#94a3b8',
            border: mode===m?'1px solid #6366f1':'1px solid #2e2e3e' }}>
            {m==='t2v'?'📝 Teks → Video':'🖼️ Gambar → Video'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          {mode==='i2v' && (
            <div>
              <p style={{ fontSize:12, color:'#94a3b8', marginBottom:5 }}>Gambar Awal *</p>
              <div onClick={()=>fileRef.current?.click()} style={{ border:'2px dashed #2e2e3e', borderRadius:12, padding:16, textAlign:'center', cursor:'pointer' }}>
                {b64 ? <img src={b64} alt="" style={{ maxHeight:100, margin:'auto', borderRadius:8, objectFit:'contain', width:'100%' }}/>
                  : <><div style={{ fontSize:20, marginBottom:4 }}>📁</div><p style={{ fontSize:12, color:'#64748b' }}>Upload gambar</p></>}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>e.target.files?.[0]&&loadImg(e.target.files[0])}/>
            </div>
          )}
          <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} rows={5}
            placeholder="Contoh: Pemandangan pantai tropis, ombak besar, sinematik slow motion 4K" style={{ ...INP, resize:'none' }}/>
          <input value={neg} onChange={e=>setNeg(e.target.value)} placeholder="Negative prompt" style={INP}/>
          <div className="flex gap-2">
            {['480p','720p'].map(r=>(
              <button key={r} onClick={()=>setRes(r)} style={{ flex:1, padding:'8px', borderRadius:8, fontSize:12, cursor:'pointer',
                background: res===r?'#6366f1':'#1a1a2e', color: res===r?'white':'#94a3b8',
                border: res===r?'1px solid #6366f1':'1px solid #2e2e3e' }}>{r}</button>
            ))}
          </div>
          <button onClick={generate} disabled={status==='loading'||!prompt.trim()||(mode==='i2v'&&!b64)}
            style={{ background:'#6366f1', color:'white', border:'none', borderRadius:12, padding:11, fontSize:13, cursor:'pointer',
              opacity: status==='loading'||!prompt.trim()||(mode==='i2v'&&!b64) ? .4 : 1 }}>
            {status==='loading' ? `⏳ Membuat video... ${elapsed}s` : '🎬 Generate Video'}
          </button>
          <p style={{ fontSize:11, color:'#475569', textAlign:'center' }}>Estimasi 2–5 menit. Jangan tutup halaman ini.</p>
          {error && <p style={{ color:'#fca5a5', fontSize:12 }}>❌ {error}</p>}
        </div>
        <div>
          {status==='loading' && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:300, border:'1px dashed #2e2e3e', borderRadius:16, gap:12 }}>
              <div style={{ width:36, height:36, border:'3px solid #334155', borderTopColor:'#6366f1', borderRadius:'50%', animation:'spin .7s linear infinite' }}/>
              <p style={{ color:'#94a3b8', fontSize:14 }}>Membuat video...</p>
              <p style={{ color:'#475569', fontSize:12 }}>Waktu berlalu: {elapsed}s</p>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}
          {status==='done' && videoUrl && (
            <div>
              <video src={videoUrl} controls style={{ width:'100%', borderRadius:12, border:'1px solid #2e2e3e' }}/>
              <a href={videoUrl} download="video.mp4" target="_blank" rel="noopener noreferrer"
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, marginTop:10, padding:10, background:'#059669', color:'white', borderRadius:10, fontSize:13, textDecoration:'none' }}>⬇️ Download Video</a>
            </div>
          )}
          {(status==='idle'||status==='fail') && (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:300, border:'1px dashed #2e2e3e', borderRadius:16, color:'#475569' }}>
              <span style={{ fontSize:32, opacity:.3 }}>🎬</span><p style={{ fontSize:13, marginTop:8 }}>Video akan muncul di sini</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
