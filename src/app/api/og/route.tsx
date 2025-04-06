import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    
    // For @vercel/og, we can just use the full URL
    const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const logoUrl = new URL('/logo.png', baseUrl).toString();

    return new ImageResponse(
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
              <p style={{ fontSize: 32, color: 'white', textAlign: 'center' }}>
                {username ? `@${username} is inviting you` : 'You are being invited'} to TokenFight.lol
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
  } catch (e: unknown) {
    console.log(`${e instanceof Error ? e.message : 'An error occurred'}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
} 