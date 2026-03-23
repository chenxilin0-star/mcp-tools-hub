export interface Env {
  GITHUB_TOKEN: string;
}

const CATEGORIES: Record<string, string> = {
  'database': '数据库',
  'file-system': '文件系统',
  'api': 'API',
  'ai': 'AI',
  'productivity': '效率',
  'other': '其他',
};

function categorize(topics: string[]): string {
  const s = topics.join(' ').toLowerCase();
  if (s.includes('database') || s.includes('db')) return 'database';
  if (s.includes('file') || s.includes('filesystem')) return 'file-system';
  if (s.includes('api') || s.includes('http')) return 'api';
  if (s.includes('ai') || s.includes('gpt') || s.includes('claude')) return 'ai';
  if (s.includes('productivity') || s.includes('tool')) return 'productivity';
  return 'other';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      });
    }

    // GET /tools - 返回所有 MCP 工具
    if (url.pathname === '/tools') {
      const githubUrl = 'https://api.github.com/search/repositories?q=topic:mcp-server&sort=stars&order=desc&per_page=100';
      const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'MCP-Tools-Hub/1.0',
      };
      if (env.GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${env.GITHUB_TOKEN}`;
      }

      const res = await fetch(githubUrl, { headers });
      if (!res.ok) {
        return new Response(JSON.stringify({ error: 'GitHub API failed' }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      const data = await res.json() as { items: any[] };
      const tools = (data.items || []).map((repo) => ({
        id: String(repo.id),
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || '暂无描述',
        htmlUrl: repo.html_url,
        stars: repo.stargazers_count,
        category: categorize(repo.topics || []),
        avatarUrl: repo.owner.avatar_url,
        topics: repo.topics || [],
      }));

      return new Response(JSON.stringify(tools), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600',
        }
      });
    }

    return new Response('Not Found', { status: 404 });
  }
};
