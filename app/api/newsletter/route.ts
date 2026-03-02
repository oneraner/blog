// Newsletter API placeholder - provider not configured
// Add your newsletter provider configuration here if needed

export const dynamic = 'force-static'

export async function GET() {
  return new Response(JSON.stringify({ message: 'Newsletter not configured' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST() {
  return new Response(JSON.stringify({ message: 'Newsletter not configured' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
