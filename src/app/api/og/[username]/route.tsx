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

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    // Get username from route param (path) instead of query string
    const username = params.username || 'Someone';
    
    // Get profilePic from searchParams if needed
    const { searchParams } = new URL(request.url);
    const profilePic = searchParams.get('profilePic');
    
    console.log('OG Image Request:', { 
      username,
      profilePic,
      url: request.url 
    });
    
    // Get origin directly from the request URL
    const baseUrl = new URL(request.url).origin;
    // Use the origin from request for the logo URL
    const logoUrl = new URL('/logo.png', baseUrl).toString();
    
    // Generate colors based on username for the avatar background
    const hash = hashCode(username);
    const backgroundColor = intToRGB(hash);

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
              {/* Profile picture or generated avatar */}
              {profilePic ? (
                <img
                  src={profilePic}
                  width="50"
                  height="50"
                  style={{
                    borderRadius: '50%',
                    marginRight: '15px',
                    border: '2px solid #8A63D2',
                  }}
                  alt={`${username}'s avatar`}
                />
              ) : (
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    marginRight: '15px',
                    backgroundColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    border: '2px solid #8A63D2',
                  }}
                >
                  {username.substring(0, 2).toUpperCase()}
                </div>
              )}
              
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