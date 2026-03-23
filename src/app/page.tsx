import { fetchMCPTools, ALL_CATEGORIES, type MCPTool } from '@/lib/mcp'
import HomeClient from '@/components/HomeClient'

// ISR: 每6小时重新验证
export const revalidate = 21600

export default async function Home() {
  let tools: MCPTool[] = []
  
  try {
    tools = await fetchMCPTools()
  } catch (error) {
    console.error('Failed to fetch MCP tools:', error)
    // 返回空数组，让前端显示友好提示
  }

  return <HomeClient tools={tools} categories={ALL_CATEGORIES} />
}
