"use client"

import { useState } from "react"

interface User {
  id: string
  username: string
  avatar: string
}

interface InvitedUsersProps {
  users: User[]
}

export default function InvitedUsers({ users }: InvitedUsersProps) {
  const [hoveredUser, setHoveredUser] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 py-2">
      {users.map((user) => (
        <div
          key={user.id}
          className="relative"
          onMouseEnter={() => setHoveredUser(user.id)}
          onMouseLeave={() => setHoveredUser(null)}
        >
          <div
            className={`
              flex items-center justify-center text-2xl
              rounded-full bg-primary/10 cursor-pointer
              transition-all duration-200 ease-in-out
              ${hoveredUser === user.id ? "h-14 w-14 z-10" : "h-10 w-10"}
            `}
          >
            {user.avatar}
          </div>

          {hoveredUser === user.id && (
            <div
              className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1.5 
                         bg-background border border-border rounded-md shadow-lg z-20 whitespace-nowrap"
            >
              @{user.username}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

