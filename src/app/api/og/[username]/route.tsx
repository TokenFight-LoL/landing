import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

// Cached font loading promise - loads once per isolate
const fontPromise = (async () => {
  try {
    // Generic text that covers most characters we'll need
    const text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,/@';
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Klee+One:wght@400;600&text=${encodeURIComponent(text)}`
    ).then(res => res.text());
    
    const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype|woff2?)'\)/);
    
    if (!resource) {
      console.log('No font resource found in CSS');
      return { regular: null, bold: null };
    }
    
    const res = await fetch(resource[1]);
    if (res.status !== 200) {
      console.log(`Font fetch failed with status ${res.status}`);
      return { regular: null, bold: null };
    }
    
    const buffer = await res.arrayBuffer();
    // Klee One includes both weights in a single file
    return { regular: buffer, bold: buffer };
  } catch (error) {
    console.error('Error pre-loading font:', error);
    return { regular: null, bold: null };
  }
})();

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
      profilePic: profilePic ? '[pic provided]' : 'none',
      url: request.url 
    });
    
    // Get origin directly from the request URL
    const baseUrl = new URL(request.url).origin;
    
    // Use the origin from request for the logo URL
    const logoUrl = new URL('/logo.png', baseUrl).toString();
    
    // Add background image URL - from our own domain so it's safe to load
    const backgroundUrl = new URL('/color bg.png', baseUrl).toString();
    
    // Define the brand green color
    const brandGreen = '#8AF337';

    // Pre-fetch and inline the profile picture if present
    let inlinedProfilePic: string | undefined;
    
    if (profilePic) {
      try {
        console.log(`Fetching profile pic from external URL...`);
        const response = await fetch(profilePic, { 
          cache: 'no-store',
          headers: {
            // Some headers to make the request appear more browser-like
            'User-Agent': 'Mozilla/5.0 Vercel OG Function',
            'Accept': 'image/webp,image/jpeg,image/png,image/*'
          }
        });
        
        if (response.ok) {
          const imageBuffer = await response.arrayBuffer();
          const base64Image = Buffer.from(imageBuffer).toString('base64');
          const contentType = response.headers.get('content-type') || 'image/jpeg';
          inlinedProfilePic = `data:${contentType};base64,${base64Image}`;
          console.log('Profile pic inlined successfully');
        } else {
          console.log(`Failed to fetch profile pic: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching profile pic:', error);
      }
    }
    
    // Get the cached font data
    const { regular, bold } = await fontPromise;
    
    // Prepare ImageResponse options
    const options: any = {
      width: 1200,
      height: 630,
    };
    
    // Only add fonts if both are available
    if (regular && bold) {
      options.fonts = [
        {
          name: 'Klee One',
          data: regular,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Klee One',
          data: bold,
          style: 'normal',
          weight: 600,
        },
      ];
    }
    
    const res = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            fontFamily: options.fonts?.length > 0 ? 'Klee One' : 'sans-serif',
            padding: '0',
            margin: '0',
            overflow: 'hidden',
            backgroundColor: '#000000', // Explicit black background
            border: `10px solid ${brandGreen}`, // Simple green border
            boxSizing: 'border-box',
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
                {/* Profile picture with enhanced styling - use the inlined pic if we have it */}
                {inlinedProfilePic ? (
                  <img
                    src={inlinedProfilePic}
                    width="280"
                    height="280"
                    style={{
                      borderRadius: '50%',
                      marginBottom: '25px',
                      border: `5px solid ${brandGreen}`, // Green border on profile picture
                      boxShadow: `0 0 20px ${brandGreen}`, // Simple glow with no RGBA for better compatibility
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
                      boxShadow: `0 0 20px ${brandGreen}`, // Simple glow with no RGBA for better compatibility
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
                  fontFamily: options.fonts?.length > 0 ? 'Klee One' : 'sans-serif',
                  textShadow: '0 2px 4px #000000', // Use hex colors instead of rgba
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
                  fontFamily: options.fonts?.length > 0 ? 'Klee One' : 'sans-serif',
                  textShadow: '0 1px 2px #000000', // Use hex colors instead of rgba
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
                    fontFamily: options.fonts?.length > 0 ? 'Klee One' : 'sans-serif',
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
                    textShadow: '0 2px 4px #000000' // Use hex colors instead of rgba
                  }}>
                    TRADE
                  </div>
                  <div style={{ textShadow: '0 2px 4px #000000' }}>
                    TOKENS
                  </div>
                  <div style={{ textShadow: '0 2px 4px #000000' }}>
                    THAT
                  </div>
                  <div style={{ 
                    color: brandGreen, 
                    fontWeight: 'bold', 
                    textShadow: '0 2px 4px #000000' // Use hex colors instead of rgba
                  }}>
                    KILL
                  </div>
                  <div style={{ textShadow: '0 2px 4px #000000' }}>
                    EACH
                  </div>
                  <div style={{ textShadow: '0 2px 4px #000000' }}>
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
                      // Removed filter:drop-shadow - not supported well by Satori
                    }}
                    alt="TokenFight Logo"
                  />
                  <p style={{ 
                    fontSize: 36, 
                    color: 'white', 
                    textAlign: 'left',
                    margin: 0,
                    fontFamily: options.fonts?.length > 0 ? 'Klee One' : 'sans-serif',
                    fontWeight: '600',
                    textShadow: '0 2px 4px #000000', // Use hex colors instead of rgba
                  }}>
                    TokenFight.LoL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      options
    );
    
    // Add cache headers for Twitter and other social media platforms
    res.headers.set(
      'Cache-Control',
      'public, immutable, no-transform, s-maxage=31536000, max-age=31536000'
    );
    
    return res;
    
  } catch (e: unknown) {
    console.error('OG Image generation error:', e);
    
    // Fallback to a very basic image if anything fails
    try {
      const simpleFallback = new ImageResponse(
        (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            padding: '20px',
            border: '10px solid #8AF337',
          }}>
            <div style={{textAlign: 'center'}}>
              <div style={{ fontSize: '36px', marginBottom: '10px', color: '#CCCCCC' }}>@{(await params).username} is inviting you to</div>
              <div style={{ fontSize: '68px', fontWeight: 'bold', marginBottom: '20px', color: 'white' }}>TokenFight</div>
              <div style={{ fontSize: '32px', color: '#8AF337' }}>Trade tokens that kill each other</div>
            </div>
          </div>
        ),
        { width: 1200, height: 630 }
      );
      
      // Add cache headers for Twitter
      simpleFallback.headers.set(
        'Cache-Control',
        'public, immutable, no-transform, s-maxage=31536000, max-age=31536000'
      );
      
      return simpleFallback;
    } catch (fallbackError) {
      console.error('Even fallback image failed:', fallbackError);
      return new Response(`Failed to generate the image: ${e instanceof Error ? e.message : 'Unknown error'}`, {
        status: 500,
      });
    }
  }
}