"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, MessageSquare, PenTool, Languages, Sparkles, Wand2, Film } from 'lucide-react'

const NAV = [
  { href: '/',           label: 'Dashboard',     Icon: Home },
  { href: '/chat',       label: 'AI Chat',        Icon: MessageSquare },
  { href: '/tools',      label: 'Alat Teks',      Icon: PenTool },
  { href: '/translate',  label: 'Terjemahan',     Icon: Languages },
  { href: '/image',      label: 'Generate Gambar',Icon: Sparkles },
  { href: '/image-edit', label: 'Edit Gambar',    Icon: Wand2 },
  { href: '/video',      label: 'Generate Video', Icon: Film },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside className="w-56 flex-shrink-0 flex flex-col" style={{ background: '#0d0d14', borderRight: '1px solid #1e1e2e' }}>
      <div className="p-4 flex items-center gap-2" style={{ borderBottom: '1px solid #1e1e2e' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold"
          style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)' }}>✦</div>
        <div>
          <p className="text-sm font-bold text-white leading-none">AI Assistant</p>
          <p className="text-xs" style={{ color: '#475569' }}>Alibaba Cloud</p>
        </div>
      </div>
      <nav className="flex-1 p-2 flex flex-col gap-0.5">
        {NAV.map(({ href, label, Icon }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href)
          return (
            <Link key={href} href={href} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all"
              style={{ background: active ? 'rgba(99,102,241,.15)' : 'transparent',
                       color: active ? '#a5b4fc' : '#94a3b8',
                       border: active ? '1px solid rgba(99,102,241,.25)' : '1px solid transparent' }}>
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 text-center text-xs" style={{ color: '#334155', borderTop: '1px solid #1e1e2e' }}>
        Powered by DashScope API
      </div>
    </aside>
  )
}
