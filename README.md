# 🤖 AI Assistant – Alibaba Cloud

Aplikasi AI asisten berbasis web, deploy ke Vercel via GitHub.

## 🚀 Deploy ke Vercel (Step-by-step)

### 1. Persiapan lokal
```bash
# Install dependencies
npm install

# Jalankan lokal untuk testing
cp .env.example .env.local
# Edit .env.local, isi DASHSCOPE_API_KEY
npm run dev
# Buka http://localhost:3000
```

### 2. Push ke GitHub
```bash
git init
git add .
git commit -m "Initial commit: AI Assistant"
git branch -M main
git remote add origin https://github.com/USERNAME/ai-assistant.git
git push -u origin main
```

### 3. Deploy ke Vercel
1. Buka https://vercel.com dan login
2. Klik **Add New → Project**
3. Pilih repo GitHub kamu
4. Di bagian **Environment Variables**, tambahkan:
   - `DASHSCOPE_API_KEY` = `sk-xxxxxxxx` (API Key kamu)
   - `DASHSCOPE_BASE_URL` = `https://dashscope-intl.aliyuncs.com`
5. Klik **Deploy** → Selesai! 🎉

## ✨ Fitur
- 💬 AI Chat (streaming, qwen-max/plus/turbo/long)
- ✍️ 9 Alat Teks (ringkasan, kode, SEO, email, dll)
- 🌐 Terjemahan 20+ bahasa
- ✨ Generate Gambar (Tongyi Wanxiang wanx-v1)
- 🎨 Edit Gambar (style transfer)
- 🎬 Generate Video (Wan2.1 t2v & i2v)

## 🔑 API Key
Daftar gratis di: https://dashscope-intl.console.aliyun.com
