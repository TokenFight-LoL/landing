import { ImageResponse } from '@vercel/og';

// Use Edge runtime for fastest performance with @vercel/og
export const runtime = 'edge';

/**
 * PERFORMANCE OPTIMIZATIONS FOR TWITTER CARD GENERATION
 * 
 * Twitter bot has a very strict timeout of approximately 5 seconds for fetching OG images.
 * If the image generation takes longer, Twitter will fall back to text-only cards.
 * 
 * These optimizations ensure that even cold starts complete within Twitter's timeout:
 * 1. Using system fonts instead of custom fonts to eliminate loading time
 * 2. Using CSS gradients instead of background images to reduce network requests
 * 3. Pre-fetching and caching the logo image to avoid multiple requests
 * 4. Strong cache headers: public, immutable, s-maxage=31536000
 */

// Define params as Promise for Next.js 15 - for metadata generation
type Params = Promise<{ username: string }>;

// Cache for logo image to avoid refetching
let logoImageCache: string | null = null;

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
    
    // Get logo URL - use module-level caching to avoid multiple fetches
    let logoUrl: string;
    
    if (!logoImageCache) {
      logoUrl = new URL('/logo.png', baseUrl).toString();
      // We don't convert to data URI to save memory
      // Just let the CDN handle caching the image
      logoImageCache = logoUrl;
    } else {
      logoUrl = logoImageCache;
    }
    
    // Define the brand green color
    const brandGreen = '#8AF337';

    // Using system fonts to avoid memory issues with embedded fonts
    const res = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            fontFamily: '"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            padding: '0',
            margin: '0',
            overflow: 'hidden',
            background: 'linear-gradient(45deg, #000000, #101010, #1a1a1a)', // Simple dark gradient background
            boxSizing: 'border-box',
          }}
        >
          {/* Background gradient overlay for visual interest */}
          <div 
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at 70% 30%, rgba(50, 50, 50, 0.3) 0%, rgba(0, 0, 0, 0) 70%)',
              zIndex: 1,
            }}
          />
          
          {/* Main content container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              width: '100%',
              position: 'relative',
              padding: '40px 50px',
              zIndex: 2,
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
                  width: '40%',
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
                      border: `5px solid ${brandGreen}`,
                      boxShadow: `0 0 20px rgba(138, 243, 55, 0.6), 0 0 10px rgba(255, 255, 255, 0.3)`,
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
                      backgroundColor: brandGreen,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '100px',
                      border: `5px solid ${brandGreen}`,
                      boxShadow: `0 0 20px rgba(138, 243, 55, 0.6), 0 0 10px rgba(255, 255, 255, 0.3)`,
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
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
                  maxWidth: '100%',
                  wordBreak: 'break-word',
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
                  width: '60%',
                  padding: '20px',
                }}
              >
                {/* "inviting to" text above the main title */}
                <p style={{ 
                  fontSize: 24, 
                  color: '#D8D8D8', 
                  textAlign: 'left',
                  margin: 0,
                  marginBottom: '8px',
                  fontWeight: '400',
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
                    marginTop: '10px',
                  }}
                >
                  <img
                    width="36"
                    height="36"
                    src={logoUrl}
                    style={{
                      marginRight: '12px',
                      filter: 'drop-shadow(0 0 6px rgba(138, 243, 55, 0.7))',
                    }}
                    alt="TokenFight Logo"
                  />
                  <p style={{ 
                    fontSize: 36, 
                    color: 'white', 
                    textAlign: 'left',
                    margin: 0,
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