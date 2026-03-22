import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MCP工具导航 | Model Context Protocol 工具大全',
  description: '发现最优质的MCP工具，数据库、文件系统、AI能力一网打尽',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
