import { ImageResponse } from '@vercel/og';
import { KLEE_ONE_REGULAR, KLEE_ONE_SEMIBOLD } from '@/lib/embedded-fonts';

// Use Edge runtime for fastest performance with @vercel/og
export const runtime = 'edge';

/**
 * PERFORMANCE OPTIMIZATIONS FOR TWITTER CARD GENERATION
 * 
 * Twitter bot has a very strict timeout of approximately 5 seconds for fetching OG images.
 * If the image generation takes longer, Twitter will fall back to text-only cards.
 * 
 * These optimizations ensure that even cold starts complete within Twitter's timeout:
 * 1. Zero-fetch approach: Fonts are embedded directly in the code as ArrayBuffers
 * 2. No external dependencies: All assets are either embedded or loaded from the CDN
 * 3. Strong cache headers: public, immutable, s-maxage=31536000
 */

// Define params as Promise for Next.js 15 - for metadata generation
type Params = Promise<{ username: string }>;

// Updated for Next.js 15 route handler types
export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  try {
    // Get username from route param (path) instead of query string
    const { username } = await params;
    
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
    
    // Get URLs for assets - served from Vercel's CDN
    const logoUrl = new URL('/logo.png', baseUrl).toString();
    const backgroundUrl = new URL('/color bg.png', baseUrl).toString();
    
    // Define the brand green color
    const brandGreen = '#8AF337';

    // No need for async loading - fonts are already available as ArrayBuffers
    // This completely eliminates network requests for fonts
    const fontDataRegular = KLEE_ONE_REGULAR;
    const fontDataBold = KLEE_ONE_SEMIBOLD;

    const res = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            fontFamily: 'Klee One',
            padding: '0',
            margin: '0',
            overflow: 'hidden',
            backgroundColor: '#000000', // Explicit black background
            boxSizing: 'border-box', // Keep standard sizing; border removed for subtler effect
          }}
        >
          {/* Background container */}
          <div 
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              width: '100%',
              height: '100%',
              display: 'flex',
              margin: '0',
              padding: '0',
            }}
          >
            {/* Background image */}
            <img
              src={backgroundUrl}
              alt="Background"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                margin: '0',
                padding: '0',
                opacity: 0.9, // Slightly dimmed for better text contrast
              }}
            />
            
            {/* Dark overlay for better text contrast */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.35)', // Slightly darker overlay for better text contrast
              }}
            />
          </div>
          
          
          
          {/* Main content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
              position: 'relative',
              padding: '40px 50px', // Increased horizontal padding
            }}
          >
            {/* Upper section with profile and text */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                flex: 1,
              }}
            >
              {/* Left column: Profile picture and username - exactly 40% width */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40%', // Reduced from 50% to give more space to text
                  padding: '20px',
                }}
              >
                {/* Profile picture with enhanced styling */}
                {profilePic ? (
                  <img
                    src={profilePic}
                    width="280"
                    height="280"
                    style={{
                      borderRadius: '50%',
                      marginBottom: '25px',
                      border: `5px solid ${brandGreen}`, // Green border on profile picture
                      boxShadow: `0 0 20px rgba(138, 243, 55, 0.6), 0 0 10px rgba(255, 255, 255, 0.3)`, // Enhanced glow effect
                    }}
                    alt={`${username}'s avatar`}
                  />
                ) : (
                  <div
                    style={{
                      width: '280px',
                      height: '280px',
                      borderRadius: '50%',
                      marginBottom: '25px',
                      backgroundColor: brandGreen, // Use brand green as background
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '100px',
                      border: `5px solid ${brandGreen}`, // Green border on profile picture
                      boxShadow: `0 0 20px rgba(138, 243, 55, 0.6), 0 0 10px rgba(255, 255, 255, 0.3)`, // Enhanced glow effect
                    }}
                  >
                    {username.substring(0, 2).toUpperCase()}
                  </div>
                )}
                
                {/* Username with enhanced styling */}
                <p style={{ 
                  fontSize: 38, 
                  color: 'white', 
                  textAlign: 'center',
                  margin: 0,
                  fontWeight: '600',
                  fontFamily: 'Klee One',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                  maxWidth: '100%', // Ensure text doesn't overflow
                  wordBreak: 'break-word', // Break long usernames
                }}>
                  @{username}
                </p>
              </div>
              
              {/* Right column: "TRADE TOKENS THAT KILL" text */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  width: '60%', // Increased from 50% to give more space to text
                  padding: '20px',
                }}
              >
                {/* "inviting to" text above the main title */}
                <p style={{ 
                  fontSize: 24, 
                  color: '#D8D8D8', 
                  textAlign: 'left',
                  margin: 0,
                  marginBottom: '8px', // Increased spacing
                  fontWeight: '400',
                  fontFamily: 'Klee One',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '1px',
                }}>
                  inviting to
                </p>
                
                {/* Using a div-based approach to separate each word completely */}
                <div
                  style={{
                    fontSize: 50, 
                    fontWeight: '600',
                    color: 'white',
                    textAlign: 'left',
                    margin: 0,
                    marginBottom: '30px',
                    lineHeight: '1.3',
                    fontFamily: 'Klee One',
                    letterSpacing: '0.5px',
                    maxWidth: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div style={{ 
                    color: brandGreen, 
                    fontWeight: 'bold', 
                    textShadow: '0 0 8px rgba(138, 243, 55, 0.7), 0 0 2px rgba(255, 255, 255, 0.3)' 
                  }}>
                    TRADE
                  </div>
                  <div style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                    TOKENS
                  </div>
                  <div style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                    THAT
                  </div>
                  <div style={{ 
                    color: brandGreen, 
                    fontWeight: 'bold', 
                    textShadow: '0 0 8px rgba(138, 243, 55, 0.7), 0 0 2px rgba(255, 255, 255, 0.3)' 
                  }}>
                    KILL
                  </div>
                  <div style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                    EACH
                  </div>
                  <div style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)' }}>
                    OTHER
                  </div>
                </div>
                
                {/* Website info below the text with enhanced styling */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    marginTop: '10px', // Increased spacing
                  }}
                >
                  <img
                    width="36"
                    height="36"
                    src={logoUrl}
                    style={{
                      marginRight: '12px',
                      filter: 'drop-shadow(0 0 6px rgba(138, 243, 55, 0.7))', // Enhanced logo glow
                    }}
                    alt="TokenFight Logo"
                  />
                  <p style={{ 
                    fontSize: 36, 
                    color: 'white', 
                    textAlign: 'left',
                    margin: 0,
                    fontFamily: 'Klee One',
                    fontWeight: '600',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                  }}>
                    TokenFight.LoL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Klee One',
            data: fontDataRegular,
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Klee One',
            data: fontDataBold,
            style: 'normal',
            weight: 600,
          },
        ],
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