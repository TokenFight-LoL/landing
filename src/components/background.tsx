"use client"
import Image from "next/image"

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
}

export default function Background() {
  // Define token positions
  const tokens: TokenPosition[] = [
    {
      id: 1,
      src: "/Token (1).png",
      alt: "Token 1",
      size: 45,
      top: "40%",
      left: "75%",
      opacity: 0.9,
    },
    {
      id: 2,
      src: "/Token (2).png",
      alt: "Token 2",
      size: 55,
      top: "68%",
      left: "88%",
      opacity: 0.85,
    },
    {
      id: 3,
      src: "/Token (3).png",
      alt: "Token 3",
      size: 60,
      top: "82%",
      left: "70%",
      opacity: 0.9,
    },
    {
      id: 4,
      src: "/Token (4).png",
      alt: "Token 4",
      size: 50,
      top: "58%",
      left: "94%",
      opacity: 0.8,
    },
    {
      id: 5,
      src: "/Token (5).png",
      alt: "Token 5",
      size: 65,
      top: "30%",
      left: "90%",
      opacity: 0.8,
    },
    {
      id: 6,
      src: "/Token (6).png",
      alt: "Token 6",
      size: 40,
      top: "15%",
      left: "80%",
      opacity: 0.85,
    },
    {
      id: 7,
      src: "/Token (7).png",
      alt: "Token 7",
      size: 55,
      top: "10%",
      left: "70%",
      opacity: 0.75,
    },
    {
      id: 8,
      src: "/Token (8).png",
      alt: "Token 8",
      size: 48,
      top: "18%",
      left: "60%",
      opacity: 0.8,
    },
    {
      id: 9,
      src: "/Token (9).png",
      alt: "Token 9",
      size: 45,
      top: "35%",
      left: "50%",
      opacity: 0.9,
    },
    {
      id: 10,
      src: "/Token (10).png",
      alt: "Token 10",
      size: 52,
      top: "50%",
      left: "40%",
      opacity: 0.85,
    },
    {
      id: 11,
      src: "/Token (11).png",
      alt: "Token 11",
      size: 58,
      top: "65%",
      left: "28%",
      opacity: 0.8,
    },
    {
      id: 12,
      src: "/Token (12).png",
      alt: "Token 12",
      size: 50,
      top: "78%",
      left: "18%",
      opacity: 0.9,
    },
    {
      id: 13,
      src: "/Token (13).png",
      alt: "Token 13",
      size: 44,
      top: "85%",
      left: "35%",
      opacity: 0.8,
    },
    {
      id: 14,
      src: "/Token (14).png",
      alt: "Token 14",
      size: 55,
      top: "72%",
      left: "52%",
      opacity: 0.7,
    },
    {
      id: 15,
      src: "/Token (15).png",
      alt: "Token 15",
      size: 42,
      top: "60%",
      left: "65%",
      opacity: 0.75,
    },
    {
      id: 16,
      src: "/Token (16).png",
      alt: "Token 16",
      size: 40,
      top: "45%",
      left: "85%",
      opacity: 0.8,
    },
    {
      id: 17,
      src: "/Token (17).png",
      alt: "Token 17",
      size: 45,
      top: "25%",
      left: "40%",
      opacity: 0.9,
    },
    {
      id: 18,
      src: "/Token (18).png",
      alt: "Token 18",
      size: 38,
      top: "15%",
      left: "30%",
      opacity: 0.85,
    },
    {
      id: 19,
      src: "/Token (19).png",
      alt: "Token 19",
      size: 55,
      top: "10%",
      left: "15%",
      opacity: 0.75,
    },
    {
      id: 20,
      src: "/Token (20).png",
      alt: "Token 20",
      size: 60,
      top: "25%",
      left: "10%",
      opacity: 0.8,
    },
    {
      id: 21,
      src: "/Token (21).png",
      alt: "Token 21",
      size: 48,
      top: "40%",
      left: "15%",
      opacity: 0.85,
    },
    {
      id: 22,
      src: "/Token (22).png",
      alt: "Token 22",
      size: 65,
      top: "55%",
      left: "8%",
      opacity: 0.9,
    },
    {
      id: 23,
      src: "/Token (23).png",
      alt: "Token 23",
      size: 55,
      top: "75%",
      left: "5%",
      opacity: 0.8,
    },
    {
      id: 24,
      src: "/Token (24).png",
      alt: "Token 24",
      size: 62,
      top: "90%",
      left: "12%",
      opacity: 0.75,
    },
    {
      id: 25,
      src: "/Token (25).png",
      alt: "Token 25",
      size: 58,
      top: "88%",
      left: "60%",
      opacity: 0.85,
    },
    {
      id: 26,
      src: "/Token (26).png",
      alt: "Token 26",
      size: 52,
      top: "30%",
      left: "65%",
      opacity: 0.9,
    },
    {
      id: 0,
      src: "/Token.png",
      alt: "Token",
      size: 60,
      top: "5%",
      left: "45%",
      opacity: 0.85,
    },
  ]

  return (
    <div className="relative w-[1920px] h-[1080px] overflow-hidden">
      {/* Base gradient background */}
      <Image
        src="/color bg.png"
        alt="Background Gradient"
        fill
        className="object-cover"
        priority
      />

      {/* Token images */}
      {tokens.map((token) => (
        <div
          key={token.id}
          className="absolute"
          style={{
            top: token.top,
            left: token.left,
            zIndex: token.zIndex || 10,
          }}
        >
          <Image
            src={token.src || "/placeholder.svg"}
            alt={token.alt}
            width={token.size}
            height={token.size}
            className={`${token.blur ? `blur-${token.blur}` : ""}`}
            style={{ opacity: token.opacity || 1 }}
          />
        </div>
      ))}
    </div>
  )
}

