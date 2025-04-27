"use client"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"

interface TokenPosition {
  id: number
  src: string
  alt: string
  size: number
  top: string
  left: string
  blur?: string
  zIndex?: number
  opacity?: number
  floatDuration?: string
  floatDelay?: string
  pulseDuration?: string
  pulseDelay?: string
}

export default function Background() {
  const [isPanning, setIsPanning] = useState(false);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [panLimits, setPanLimits] = useState({ x: 0, y: 0 });

  // Define token positions
  const [tokens, setTokens] = useState<TokenPosition[]>([
    {
      id: 1,
      src: "/Token (1).png",
      alt: "Token 1",
      size: 65,
      top: "12%",
      left: "82%",
      opacity: 0.9,
    },
    {
      id: 2,
      src: "/Token (2).png",
      alt: "Token 2",
      size: 100,
      top: "34%",
      left: "96%",
      opacity: 0.85,
    },
    {
      id: 3,
      src: "/Token (3).png",
      alt: "Token 3",
      size: 120,
      top: "68%",
      left: "92%",
      opacity: 0.9,
    },
    {
      id: 4,
      src: "/Token (4).png",
      alt: "Token 4",
      size: 55,
      top: "78%",
      left: "86%",
      opacity: 0.8,
    },
    {
      id: 5,
      src: "/Token (5).png",
      alt: "Token 5",
      size: 90,
      top: "20%",
      left: "74%",
      opacity: 0.8,
    },
    {
      id: 6,
      src: "/Token (6).png",
      alt: "Token 6",
      size: 50,
      top: "13%",
      left: "62%",
      opacity: 0.85,
    },
    {
      id: 7,
      src: "/Token (7).png",
      alt: "Token 7",
      size: 75,
      top: "8%",
      left: "32%",
      opacity: 0.75,
    },
    {
      id: 8,
      src: "/Token (8).png",
      alt: "Token 8",
      size: 65,
      top: "30%",
      left: "26%",
      opacity: 0.8,
    },
    {
      id: 9,
      src: "/Token (9).png",
      alt: "Token 9",
      size: 60,
      top: "36%",
      left: "14%",
      opacity: 0.9,
    },
    {
      id: 10,
      src: "/Token (10).png",
      alt: "Token 10",
      size: 110,
      top: "42%",
      left: "4%",
      opacity: 0.85,
    },
    {
      id: 11,
      src: "/Token (11).png",
      alt: "Token 11",
      size: 130,
      top: "60%",
      left: "8%",
      opacity: 0.8,
    },
    {
      id: 12,
      src: "/Token (12).png",
      alt: "Token 12",
      size: 70,
      top: "82%",
      left: "14%",
      opacity: 0.9,
    },
    {
      id: 13,
      src: "/Token (13).png",
      alt: "Token 13",
      size: 75,
      top: "94%",
      left: "28%",
      opacity: 0.8,
    },
    {
      id: 14,
      src: "/Token (14).png",
      alt: "Token 14",
      size: 95,
      top: "84%",
      left: "46%",
      opacity: 0.7,
    },
    {
      id: 15,
      src: "/Token (15).png",
      alt: "Token 15",
      size: 50,
      top: "68%",
      left: "62%",
      opacity: 0.75,
    },
    {
      id: 16,
      src: "/Token (16).png",
      alt: "Token 16",
      size: 75,
      top: "54%",
      left: "74%",
      opacity: 0.8,
    },
    {
      id: 17,
      src: "/Token (17).png",
      alt: "Token 17",
      size: 65,
      top: "46%",
      left: "68%",
      opacity: 0.9,
    },
    {
      id: 18,
      src: "/Token (18).png",
      alt: "Token 18",
      size: 60,
      top: "15%",
      left: "20%",
      opacity: 0.85,
    },
    {
      id: 19,
      src: "/Token (19).png",
      alt: "Token 19",
      size: 75,
      top: "5%",
      left: "8%",
      opacity: 0.75,
    },
    {
      id: 20,
      src: "/Token (20).png",
      alt: "Token 20",
      size: 145,
      top: "25%",
      left: "3%",
      opacity: 0.8,
    },
    {
      id: 21,
      src: "/Token (21).png",
      alt: "Token 21",
      size: 70,
      top: "52%",
      left: "28%",
      opacity: 0.85,
    },
    {
      id: 22,
      src: "/Token (22).png",
      alt: "Token 22",
      size: 115,
      top: "64%",
      left: "36%",
      opacity: 0.9,
    },
    {
      id: 23,
      src: "/Token (23).png",
      alt: "Token 23",
      size: 80,
      top: "72%",
      left: "24%",
      opacity: 0.8,
    },
    {
      id: 24,
      src: "/Token (24).png",
      alt: "Token 24",
      size: 125,
      top: "88%",
      left: "66%",
      opacity: 0.75,
    },
    {
      id: 25,
      src: "/Token (25).png",
      alt: "Token 25",
      size: 105,
      top: "76%",
      left: "78%",
      opacity: 0.85,
    },
    {
      id: 26,
      src: "/Token (26).png",
      alt: "Token 26",
      size: 75,
      top: "48%",
      left: "82%",
      opacity: 0.9,
    },
    {
      id: 0,
      src: "/Token.png",
      alt: "Token",
      size: 90,
      top: "6%",
      left: "46%",
      opacity: 0.85,
      zIndex: 11,
    },
  ]);

  // Add animation durations and delays on client side
  useEffect(() => {
    const animatedTokens = tokens.map(token => {
      // Random floating animation duration between 1.5-3s (faster than original 3-6s)
      const floatDuration = 1.5 + Math.random() * 1.5;
      // Random floating animation delay between 0-1s (reduced from 0-2s)
      const floatDelay = Math.random() * 1;
      
      // Random pulse animation duration between 2-4s (faster than original 4-8s)
      const pulseDuration = 2 + Math.random() * 2;
      // Random pulse animation delay between 0-1.5s (reduced from 0-3s)
      const pulseDelay = Math.random() * 1.5;
      
      return {
        ...token,
        floatDuration: `${floatDuration}s`,
        floatDelay: `${floatDelay}s`,
        pulseDuration: `${pulseDuration}s`,
        pulseDelay: `${pulseDelay}s`
      };
    });
    
    setTokens(animatedTokens);
  }, []);

  // Calculate safe panning limits based on viewport size
  useEffect(() => {
    // Function to calculate max panning values to avoid revealing black space
    const calculatePanLimits = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const backgroundWidth = 3000;
      const backgroundHeight = 1800;
      
      // Calculate how much of the background extends beyond the viewport
      // This is the total available "excess" space we can use for panning
      const excessWidth = Math.max(0, backgroundWidth - viewportWidth);
      const excessHeight = Math.max(0, backgroundHeight - viewportHeight);
      
      // The maximum distance we can pan in each direction is half of the excess dimension
      // This ensures we never reveal black edges on either side
      // We convert to percentage of background size for CSS transforms
      const maxPanX = excessWidth > 0 ? (excessWidth / 2) / backgroundWidth * 100 : 0;
      const maxPanY = excessHeight > 0 ? (excessHeight / 2) / backgroundHeight * 100 : 0;
      
      setPanLimits({ x: maxPanX, y: maxPanY });
      
      // Only enable panning if we have meaningful space to pan
      // Requiring at least 2% of movement to enable panning
      setIsPanning(maxPanX > 2 && maxPanY > 2);
      
      // Log for debugging
      console.log(`Viewport: ${viewportWidth}x${viewportHeight}, Background: ${backgroundWidth}x${backgroundHeight}`);
      console.log(`Excess: ${excessWidth}x${excessHeight}, Max Pan: ${maxPanX}%x${maxPanY}%`);
    };

    // Calculate on initial load
    calculatePanLimits();

    // Add event listener for window resize
    window.addEventListener('resize', calculatePanLimits);

    // Cleanup
    return () => window.removeEventListener('resize', calculatePanLimits);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
      <div 
        ref={backgroundRef}
        className={`absolute w-[3000px] h-[1800px] ${isPanning ? 'panning-background' : ''} min-w-full min-h-full`}
        style={{
          // Apply dynamic CSS variables for animation limits
          '--max-x': `${panLimits.x}%`,
          '--max-y': `${panLimits.y}%`,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        } as React.CSSProperties}
      >
        {/* Base gradient background */}
        <Image
          src="/color bg.png"
          alt="Background Gradient"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 3000px) 100vw, 3000px"
        />

        <style jsx global>{`
          @keyframes float-up {
            0% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-15px) rotate(1.5deg);
            }
            100% {
              transform: translateY(0) rotate(0deg);
            }
          }

          @keyframes float-down {
            0% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(15px) rotate(-1.5deg);
            }
            100% {
              transform: translateY(0) rotate(0deg);
            }
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.08);
            }
            100% {
              transform: scale(1);
            }
          }

          @keyframes pan {
            0% {
              transform: translate(-50%, -50%);
            }
            25% {
              transform: translate(calc(-50% - var(--max-x)), calc(-50% - var(--max-y)));
            }
            50% {
              transform: translate(calc(-50% + var(--max-x)), calc(-50% - var(--max-y)));
            }
            75% {
              transform: translate(calc(-50% + var(--max-x)), calc(-50% + var(--max-y)));
            }
            100% {
              transform: translate(-50%, -50%);
            }
          }

          .token-container {
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
          }

          .token-float-up {
            animation-name: float-up;
          }

          .token-float-down {
            animation-name: float-down;
          }
          
          .token-image {
            animation: pulse infinite;
            animation-timing-function: ease-in-out;
          }

          .panning-background {
            animation: pan 45s infinite ease-in-out;
          }
        `}</style>

        {/* Token images */}
        {tokens.map((token) => (
          <div
            key={token.id}
            className={`absolute token-container ${token.id % 2 === 0 ? 'token-float-up' : 'token-float-down'}`}
            style={{
              top: token.top,
              left: token.left,
              zIndex: token.zIndex || 10,
              animationDuration: token.floatDuration,
              animationDelay: token.floatDelay,
            }}
          >
            <Image
              src={token.src || "/placeholder.svg"}
              alt={token.alt}
              width={token.size*2}
              height={token.size*2}
              className={`token-image ${token.blur ? `blur-${token.blur}` : ""}`}
              style={{ 
                opacity: token.opacity || 1,
                animationDuration: token.pulseDuration,
                animationDelay: token.pulseDelay
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

