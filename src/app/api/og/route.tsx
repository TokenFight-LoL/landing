import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

// Simple hash function for consistent colors
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

// Generate a color from a hash
function intToRGB(i: number): string {
  const c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

// Generate a simple Jazzicon-like SVG based on username
function generateJazzicon(username: string, size: number = 100): string {
  const hash = hashCode(username);
  const backgroundColor = intToRGB(hash);
  const foregroundColor = intToRGB(hash >> 3);
  const pattern = hash % 4; // Different pattern styles
  
  let patternSvg = '';
  
  // Generate different patterns based on the hash
  switch (pattern) {
    case 0: // Circles
      for (let i = 0; i < 5; i++) {
        const cx = 10 + (hash % (size - 20)) % 80;
        const cy = 10 + ((hash >> (i * 3)) % (size - 20)) % 80;
        const r = 5 + (hash % 15);
        patternSvg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${intToRGB(hash >> (i * 2))}" />`;
      }
      break;
    case 1: // Rectangles
      for (let i = 0; i < 3; i++) {
        const x = ((hash >> i) % 60) + 10;
        const y = ((hash >> (i * 2)) % 60) + 10;
        const width = 10 + (hash % 30);
        const height = 10 + ((hash >> i) % 30);
        patternSvg += `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${intToRGB(hash >> (i * 3))}" />`;
      }
      break;
    case 2: // Triangles
      for (let i = 0; i < 4; i++) {
        const x1 = ((hash >> i) % 80) + 10;
        const y1 = ((hash >> (i * 2)) % 80) + 10;
        const x2 = ((hash >> (i * 3)) % 80) + 10;
        const y2 = ((hash >> (i * 4)) % 80) + 10;
        const x3 = ((hash >> (i * 5)) % 80) + 10;
        const y3 = ((hash >> (i * 6)) % 80) + 10;
        patternSvg += `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="${intToRGB(hash >> (i * 2))}" />`;
      }
      break;
    default: // Mixed shapes
      patternSvg += `<rect x="25" y="25" width="50" height="50" fill="${foregroundColor}" />`;
      patternSvg += `<circle cx="50" cy="50" r="25" fill="${intToRGB(hash >> 5)}" />`;
      patternSvg += `<polygon points="50,25 75,50 50,75 25,50" fill="${intToRGB(hash >> 7)}" />`;
  }
  
  return `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="${backgroundColor}" />
    ${patternSvg}
  </svg>`.replace(/[#]/g, '%23');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'Someone';
    const profilePic = searchParams.get('profilePic');
    
    // Get origin directly from the request URL
    const baseUrl = new URL(request.url).origin;
    // Use the origin from request for the logo URL
    const logoUrl = new URL('/logo.png', baseUrl).toString();
    
    // Generate a Jazzicon if we don't have a profile pic
    const avatarUrl = profilePic || generateJazzicon(username, 200);

    const res = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#09090b',
            position: 'relative',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Gradient background */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '300px',
              height: '300px',
              borderRadius: '100%',
              background: 'linear-gradient(to bottom right, rgba(138, 99, 210, 0.2), rgba(103, 76, 159, 0.1))',
              filter: 'blur(60px)',
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '300px',
              height: '300px',
              borderRadius: '100%',
              background: 'linear-gradient(to top left, rgba(138, 99, 210, 0.2), rgba(103, 76, 159, 0.1))',
              filter: 'blur(60px)',
              zIndex: 1,
            }}
          />

          {/* Logo */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Use the URL directly - @vercel/og will handle fetching the image */}
            <img
              width="120"
              height="120"
              src={logoUrl}
              style={{ marginBottom: '20px' }}
              alt="TokenFight Logo"
            />
          </div>

          {/* Main Text */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h1
              style={{
                fontSize: 60,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
                marginBottom: '20px',
                background: 'linear-gradient(to right, #8A63D2, #A078E0)',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TokenFight
            </h1>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(to right, rgba(138, 99, 210, 0.2), rgba(160, 120, 224, 0.2))',
                padding: '20px 40px',
                borderRadius: '12px',
                marginBottom: '20px',
              }}
            >
              {/* Profile picture or Jazzicon */}
              <img
                src={avatarUrl}
                width="50"
                height="50"
                style={{
                  borderRadius: '50%',
                  marginRight: '15px',
                  border: '2px solid #8A63D2',
                }}
                alt={`${username}'s avatar`}
              />
              
              <p style={{ fontSize: 32, color: 'white', textAlign: 'center' }}>
                @{username} is inviting you to TokenFight.lol
              </p>
            </div>

            <p style={{ fontSize: 24, color: '#8A63D2', textAlign: 'center' }}>
              Trade tokens that kill each other
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
    
    // Add cache headers for Twitter and other social media platforms
    res.headers.set(
      'Cache-Control',
      'public, immutable, no-transform, s-maxage=31536000, max-age=31536000'
    );
    
    return res;
    
  } catch (e: unknown) {
    console.log(`${e instanceof Error ? e.message : 'An error occurred'}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
} 