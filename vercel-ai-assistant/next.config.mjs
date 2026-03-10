/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.aliyuncs.com' },
      { protocol: 'http',  hostname: '**.aliyuncs.com' },
    ],
  },
}
export default nextConfig
