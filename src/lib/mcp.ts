export interface MCPTool {
  id: string
  name: string
  fullName: string
  description: string
  htmlUrl: string
  stars: number
  category: string
  avatarUrl: string
  topics: string[]
}

const CATEGORIES = {
  'database': '数据库',
  'file-system': '文件系统',
  'api': 'API',
  'ai': 'AI',
  'productivity': '效率',
  'other': '其他',
}

function categorize(topics: string[]): string {
  const topicStr = topics.join(' ').toLowerCase()
  if (topicStr.includes('database') || topicStr.includes('db')) return 'database'
  if (topicStr.includes('file') || topicStr.includes('filesystem')) return 'file-system'
  if (topicStr.includes('api') || topicStr.includes('http')) return 'api'
  if (topicStr.includes('ai') || topicStr.includes('gpt') || topicStr.includes('claude')) return 'ai'
  if (topicStr.includes('productivity') || topicStr.includes('tool')) return 'productivity'
  return 'other'
}

export async function fetchMCPTools(): Promise<MCPTool[]> {
  // 使用GitHub Search API获取带mcp-server topic的仓库
  const url = 'https://api.github.com/search/repositories?q=topic:mcp-server&sort=stars&order=desc&per_page=50'
  
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  }
  
  // 如果有token就添加 (优先用 GH_TOKEN 避免覆盖 GitHub Actions 的 GITHUB_TOKEN)
  if (process.env.GH_TOKEN || process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `Bearer ${process.env.GH_TOKEN || process.env.GITHUB_TOKEN}`
  }

  const res = await fetch(url, { 
    headers,
    next: { revalidate: 21600 } // 6小时增量更新
  })

  if (!res.ok) {
    throw new Error(`GitHub API failed: ${res.status}`)
  }

  const data = await res.json()
  
  return (data.items || []).map((repo: any) => ({
    id: String(repo.id),
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || '暂无描述',
    htmlUrl: repo.html_url,
    stars: repo.stargazers_count,
    category: categorize(repo.topics || []),
    avatarUrl: repo.owner.avatar_url,
    topics: repo.topics || [],
  }))
}

export function getCategoryName(cat: string): string {
  return CATEGORIES[cat as keyof typeof CATEGORIES] || cat
}

export const ALL_CATEGORIES = Object.entries(CATEGORIES).map(([key, value]) => ({
  key,
  value,
}))
