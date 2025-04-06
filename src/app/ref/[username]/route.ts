import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  // Extract the user agent
  const userAgent = request.headers.get('user-agent') || '';
  
  // Check if this is likely a bot/crawler
  const isCrawler = /bot|crawler|spider|facebook|twitter|linkedin|slack|whatsapp|telegram|discord/i.test(userAgent);
  
  // For crawlers, serve the page content (which includes OG metadata)
  if (isCrawler) {
    return NextResponse.next();
  }
  
  // For regular users, redirect to home with ref parameter
  return NextResponse.redirect(new URL(`/?ref=${params.username}`, request.url));
} 