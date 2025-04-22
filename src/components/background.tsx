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
      size: 25,
      top: "12%",
      left: "82%",
      opacity: 0.9,
    },
    {
      id: 2,
      src: "/Token (2).png",
      alt: "Token 2",
      size: 55,
      top: "34%",
      left: "96%",
      opacity: 0.85,
    },
    {
      id: 3,
      src: "/Token (3).png",
      alt: "Token 3",
      size: 65,
      top: "68%",
      left: "92%",
      opacity: 0.9,
    },
    {
      id: 4,
      src: "/Token (4).png",
      alt: "Token 4",
      size: 20,
      top: "78%",
      left: "86%",
      opacity: 0.8,
    },
    {
      id: 5,
      src: "/Token (5).png",
      alt: "Token 5",
      size: 45,
      top: "20%",
      left: "74%",
      opacity: 0.8,
    },
    {
      id: 6,
      src: "/Token (6).png",
      alt: "Token 6",
      size: 18,
      top: "13%",
      left: "62%",
      opacity: 0.85,
    },
    {
      id: 7,
      src: "/Token (7).png",
      alt: "Token 7",
      size: 35,
      top: "8%",
      left: "32%",
      opacity: 0.75,
    },
    {
      id: 8,
      src: "/Token (8).png",
      alt: "Token 8",
      size: 25,
      top: "30%",
      left: "26%",
      opacity: 0.8,
    },
    {
      id: 9,
      src: "/Token (9).png",
      alt: "Token 9",
      size: 22,
      top: "36%",
      left: "14%",
      opacity: 0.9,
    },
    {
      id: 10,
      src: "/Token (10).png",
      alt: "Token 10",
      size: 58,
      top: "42%",
      left: "4%",
      opacity: 0.85,
    },
    {
      id: 11,
      src: "/Token (11).png",
      alt: "Token 11",
      size: 70,
      top: "60%",
      left: "8%",
      opacity: 0.8,
    },
    {
      id: 12,
      src: "/Token (12).png",
      alt: "Token 12",
      size: 24,
      top: "82%",
      left: "14%",
      opacity: 0.9,
    },
    {
      id: 13,
      src: "/Token (13).png",
      alt: "Token 13",
      size: 26,
      top: "94%",
      left: "28%",
      opacity: 0.8,
    },
    {
      id: 14,
      src: "/Token (14).png",
      alt: "Token 14",
      size: 50,
      top: "84%",
      left: "46%",
      opacity: 0.7,
    },
    {
      id: 15,
      src: "/Token (15).png",
      alt: "Token 15",
      size: 18,
      top: "68%",
      left: "62%",
      opacity: 0.75,
    },
    {
      id: 16,
      src: "/Token (16).png",
      alt: "Token 16",
      size: 28,
      top: "54%",
      left: "74%",
      opacity: 0.8,
    },
    {
      id: 17,
      src: "/Token (17).png",
      alt: "Token 17",
      size: 24,
      top: "46%",
      left: "68%",
      opacity: 0.9,
    },
    {
      id: 18,
      src: "/Token (18).png",
      alt: "Token 18",
      size: 22,
      top: "15%",
      left: "20%",
      opacity: 0.85,
    },
    {
      id: 19,
      src: "/Token (19).png",
      alt: "Token 19",
      size: 30,
      top: "5%",
      left: "8%",
      opacity: 0.75,
    },
    {
      id: 20,
      src: "/Token (20).png",
      alt: "Token 20",
      size: 80,
      top: "25%",
      left: "3%",
      opacity: 0.8,
    },
    {
      id: 21,
      src: "/Token (21).png",
      alt: "Token 21",
      size: 26,
      top: "52%",
      left: "28%",
      opacity: 0.85,
    },
    {
      id: 22,
      src: "/Token (22).png",
      alt: "Token 22",
      size: 60,
      top: "64%",
      left: "36%",
      opacity: 0.9,
    },
    {
      id: 23,
      src: "/Token (23).png",
      alt: "Token 23",
      size: 32,
      top: "72%",
      left: "24%",
      opacity: 0.8,
    },
    {
      id: 24,
      src: "/Token (24).png",
      alt: "Token 24",
      size: 68,
      top: "88%",
      left: "66%",
      opacity: 0.75,
    },
    {
      id: 25,
      src: "/Token (25).png",
      alt: "Token 25",
      size: 54,
      top: "76%",
      left: "78%",
      opacity: 0.85,
    },
    {
      id: 26,
      src: "/Token (26).png",
      alt: "Token 26",
      size: 30,
      top: "48%",
      left: "82%",
      opacity: 0.9,
    },
    {
      id: 0,
      src: "/Token.png",
      alt: "Token",
      size: 42,
      top: "6%",
      left: "46%",
      opacity: 0.85,
      zIndex: 11,
    },
  ]);

  // Add animation durations and delays on client side
  useEffect(() => {
    const animatedTokens = tokens.map(token => {
      // Random floating animation duration between 3-6s
      const floatDuration = 3 + Math.random() * 3;
      // Random floating animation delay between 0-2s
      const floatDelay = Math.random() * 2;
      
      // Random pulse animation duration between 4-8s
      const pulseDuration = 4 + Math.random() * 4;
      // Random pulse animation delay between 0-3s
      const pulseDelay = Math.random() * 3;
      
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
      const backgroundWidth = 1920;
      const backgroundHeight = 1080;
      
      // Calculate how much of the background extends beyond the viewport
      const overflowX = Math.max(0, backgroundWidth - viewportWidth);
      const overflowY = Math.max(0, backgroundHeight - viewportHeight);
      
      // Calculate maximum safe percentage to translate
      // This ensures we never pan beyond the edge of the background
      const maxTranslateX = Math.min(20, (overflowX / backgroundWidth) * 100);
      const maxTranslateY = Math.min(20, (overflowY / backgroundHeight) * 100);
      
      setPanLimits({ x: maxTranslateX, y: maxTranslateY });
      
      // Also update panning state
      setIsPanning(viewportWidth < backgroundWidth || viewportHeight < backgroundHeight);
    };

    // Calculate on initial load
    calculatePanLimits();

    // Add event listener for window resize
    window.addEventListener('resize', calculatePanLimits);

    // Cleanup
    return () => window.removeEventListener('resize', calculatePanLimits);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div 
        ref={backgroundRef}
        className={`relative w-[1920px] h-[1080px] ${isPanning ? 'panning-background' : ''}`}
        style={{
          // Apply dynamic CSS variables for animation limits
          '--max-x': `${panLimits.x}%`,
          '--max-y': `${panLimits.y}%`,
        } as React.CSSProperties}
      >
        {/* Base gradient background */}
        <Image
          src="/color bg.png"
          alt="Background Gradient"
          fill
          className="object-cover"
          priority
        />

        <style jsx global>{`
          @keyframes float-up {
            0% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-10px) rotate(1deg);
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
              transform: translateY(10px) rotate(-1deg);
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
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
            }
          }

          @keyframes pan {
            0% {
              transform: translate(0%, 0%);
            }
            25% {
              transform: translate(calc(-1 * var(--max-x)), calc(-0.5 * var(--max-y)));
            }
            50% {
              transform: translate(calc(-0.7 * var(--max-x)), calc(-1 * var(--max-y)));
            }
            75% {
              transform: translate(calc(-0.3 * var(--max-x)), calc(-0.8 * var(--max-y)));
            }
            100% {
              transform: translate(0%, 0%);
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
            animation: pan 90s infinite ease-in-out;
            transform-origin: center center;
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

