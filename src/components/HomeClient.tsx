'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { MCPTool } from '@/lib/mcp'

interface Props {
  tools: MCPTool[]
  categories: { key: string; value: string }[]
}

function StarIcon() {
  return (
    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

export default function HomeClient({ tools, categories }: Props) {
  const [search, setSearch] = useState('')
  const [selectedCats, setSelectedCats] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'stars' | 'name'>('stars')

  const filtered = useMemo(() => {
    let result = tools

    // 搜索过滤
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      )
    }

    // 分类过滤
    if (selectedCats.length > 0) {
      result = result.filter(t => selectedCats.includes(t.category))
    }

    // 排序
    result = [...result].sort((a, b) => {
      if (sortBy === 'stars') return b.stars - a.stars
      return a.name.localeCompare(b.name)
    })

    return result
  }, [tools, search, selectedCats, sortBy])

  const toggleCat = (cat: string) => {
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MCP Tools Hub
              </h1>
              <p className="text-sm text-gray-400 mt-1">发现最优质的 Model Context Protocol 工具</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{tools.length}</span>
              <span>个工具</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 搜索 + 筛选 */}
        <div className="mb-8 space-y-4">
          {/* 搜索框 */}
          <div className="relative">
            <SearchIcon />
            <input
              type="text"
              placeholder="搜索工具名称或描述..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              <SearchIcon />
            </div>
          </div>

          {/* 分类标签 + 排序 */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => toggleCat(cat.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedCats.includes(cat.key)
                      ? 'bg-primary text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {cat.value}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'stars' | 'name')}
              className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 focus:outline-none focus:border-primary/50"
            >
              <option value="stars">按Stars排序</option>
              <option value="name">按名称排序</option>
            </select>
          </div>
        </div>

        {/* 结果统计 */}
        <div className="mb-6 text-sm text-gray-500">
          找到 <span className="text-white font-medium">{filtered.length}</span> 个工具
        </div>

        {/* 工具卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(tool => (
            <a
              key={tool.id}
              href={tool.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group glass rounded-2xl p-5 card-hover block"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                  <Image
                    src={tool.avatarUrl}
                    alt={tool.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white group-hover:text-primary transition-colors truncate">
                      {tool.name}
                    </h3>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <StarIcon />
                      {tool.stars.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                    {tool.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="category-tag">
                      {categories.find(c => c.key === tool.category)?.value || tool.category}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* 空状态 */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">没有找到匹配的工具</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-500">
          <p>MCP Tools Hub · 数据来源于 GitHub · 每6小时自动更新</p>
        </div>
      </footer>
    </main>
  )
}
