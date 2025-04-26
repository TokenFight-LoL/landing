import { ImageResponse } from '@vercel/og';

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

// Function to load Google Font
async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype|woff2?)'\)/);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error('Failed to load font data');
}

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
    // Use the origin from request for the logo URL
    const logoUrl = new URL('/logo.png', baseUrl).toString();
    // Add background image URL
    const backgroundUrl = new URL('/color bg.png', baseUrl).toString();
    
    // Generate colors based on username for the avatar background
    const hash = hashCode(username);
    const backgroundColor = intToRGB(hash);

    // Prepare text for font loading
    const displayText = `TRADE TOKENS THAT KILL EACH OTHER @${username} TokenFight.LoL`;
    
    // Load Klee One font
    const fontData = await loadGoogleFont('Klee+One', displayText);

    const res = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            fontFamily: 'Klee One, sans-serif',
            padding: '0',
            margin: '0',
            overflow: 'hidden',
            backgroundColor: '#000000', // Explicit black background
          }}
        >
          {/* Background image with improved styling for full coverage */}
          <div 
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              width: '100%',
              height: '100%',
              zIndex: 1,
              display: 'flex',
              margin: '0',
              padding: '0',
            }}
          >
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
              zIndex: 2,
              padding: '40px',
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
              {/* Left column: Profile picture and username - exactly 50% width */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '50%',
                  padding: '20px',
                }}
              >
                {/* Even larger profile picture */}
                {profilePic ? (
                  <img
                    src={profilePic}
                    width="280"
                    height="280"
                    style={{
                      borderRadius: '50%',
                      marginBottom: '20px',
                      border: '2px solid #ffffff',
                    }}
                    alt={`${username}'s avatar`}
                  />
                ) : (
                  <div
                    style={{
                      width: '280px',
                      height: '280px',
                      borderRadius: '50%',
                      marginBottom: '20px',
                      backgroundColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '100px',
                      border: '2px solid #ffffff',
                    }}
                  >
                    {username.substring(0, 2).toUpperCase()}
                  </div>
                )}
                
                {/* Username */}
                <p style={{ 
                  fontSize: 36, 
                  color: 'white', 
                  textAlign: 'center',
                  margin: 0,
                  fontWeight: 'bold',
                  fontFamily: 'Klee One, sans-serif',
                }}>
                  @{username}
                </p>
              </div>
              
              {/* Right column: "TRADE TOKENS THAT KILL" text - exactly 50% width */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  width: '50%',
                  padding: '20px',
                }}
              >
                <h1
                  style={{
                    fontSize: 50,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'left',
                    margin: 0,
                    marginBottom: '20px',
                    lineHeight: '1.1',
                    fontFamily: 'Klee One, sans-serif',
                  }}
                >
                  TRADE TOKENS THAT KILL EACH OTHER
                </h1>
                
                {/* Website info below the text */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                >
                  <img
                    width="32"
                    height="32"
                    src={logoUrl}
                    style={{
                      marginRight: '10px',
                    }}
                    alt="TokenFight Logo"
                  />
                  <p style={{ 
                    fontSize: 32, 
                    color: 'white', 
                    textAlign: 'left',
                    margin: 0,
                    fontFamily: 'Klee One, sans-serif',
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
            data: fontData,
            style: 'normal',
            weight: 400,
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