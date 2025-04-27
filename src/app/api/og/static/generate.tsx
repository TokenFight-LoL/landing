import { ImageResponse } from '@vercel/og';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Path to the base OG background image
    const baseOgBgPath = path.join(process.cwd(), 'public', 'base-og-bg.png');
    
    // Convert image to base64 for embedding
    const baseOgBgBuffer = fs.readFileSync(baseOgBgPath);
    const baseOgBgBase64 = `data:image/png;base64,${baseOgBgBuffer.toString('base64')}`;
    
    // Also get the logo
    const logoPath = path.join(process.cwd(), 'public', 'logo.png');
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
    
    // Load the Klee One font
    const fontRegularPath = path.join(process.cwd(), 'public', 'fonts', 'KleeOne-Regular.ttf');
    const fontSemiBoldPath = path.join(process.cwd(), 'public', 'fonts', 'KleeOne-SemiBold.ttf');
    
    const fontRegularData = fs.readFileSync(fontRegularPath);
    const fontSemiBoldData = fs.readFileSync(fontSemiBoldPath);
    
    // Generate the image
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            fontFamily: 'Klee One',
            backgroundColor: '#000',
          }}
        >
          {/* Background image */}
          <img
            src={baseOgBgBase64}
            alt="Background"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          
          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 10,
            }}
          >
            {/* Logo and Title */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '50px',
              }}
            >
              <img
                src={logoBase64}
                alt="Token Fight Logo" 
                width="120"
                height="120"
                style={{ marginRight: '24px' }}
              />
              <div
                style={{
                  color: 'white',
                  fontSize: '64px',
                  fontWeight: 'bold',
                }}
              >
                Token Fight
              </div>
            </div>
            
            {/* Taglines */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div style={{ color: 'white', fontSize: '48px', display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <span>Fully</span>
                <span style={{ color: '#8AF337', fontWeight: 'bold' }}>on-chain</span>
                <span>MMO.</span>
              </div>
              <div style={{ color: 'white', fontSize: '48px', display: 'flex', flexDirection: 'row', gap: '8px' }}>
                <span style={{ color: '#8AF337', fontWeight: 'bold' }}>Trade</span>
                <span>tokens that</span>
                <span style={{ color: '#8AF337', fontWeight: 'bold' }}>kill</span>
                <span>each other.</span>
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
            data: fontRegularData,
            weight: 400,
            style: 'normal',
          },
          {
            name: 'Klee One',
            data: fontSemiBoldData,
            weight: 700,
            style: 'normal',
          },
        ],
      },
    );
    
    // Save the generated image to the public folder
    const outputPath = path.join(process.cwd(), 'public', 'static-og.png');
    
    // Convert ImageResponse to buffer
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Write the buffer to the file
    fs.writeFileSync(outputPath, buffer);
    
    return NextResponse.json(
      { success: true, path: '/static-og.png' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating static OG image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 