"use client"
import Link from 'next/link'

const CARDS = [
  { href:'/chat',       emoji:'💬', title:'AI Chat',         desc:'Streaming real-time. Model qwen-max, qwen-plus, qwen-turbo, qwen-long.' },
  { href:'/tools',      emoji:'✍️', title:'Alat Teks',       desc:'Ringkasan, tata bahasa, kode, SEO, email, kreatif, poin-poin, Q&A.' },
  { href:'/translate',  emoji:'🌐', title:'Terjemahan',      desc:'Terjemahkan ke 20+ bahasa dengan Qwen AI.' },
  { href:'/image',      emoji:'✨', title:'Generate Gambar', desc:'Text-to-image Tongyi Wanxiang. 9 gaya seni, berbagai ukuran.' },
  { href:'/image-edit', emoji:'🎨', title:'Edit Gambar',     desc:'Upload gambar & ubah gaya dengan AI (style transfer).' },
  { href:'/video',      emoji:'🎬', title:'Generate Video',  desc:'Teks→Video & Gambar→Video dengan Wan2.1 (480p–720p).' },
]

export default function Home() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-1">👋 AI Assistant</h1>
      <p className="text-sm mb-8" style={{ color:'#64748b' }}>Pilih fitur yang ingin kamu gunakan.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map(c => (
          <Link key={c.href} href={c.href}
            className="group p-5 rounded-2xl transition-all"
            style={{ background:'#12121a', border:'1px solid #1e1e2e' }}>
            <div className="text-2xl mb-3">{c.emoji}</div>
            <h3 className="text-sm font-semibold text-white mb-1.5 group-hover:text-indigo-300 transition-colors">{c.title}</h3>
            <p className="text-xs leading-relaxed" style={{ color:'#64748b' }}>{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
