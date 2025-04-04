"use client"

interface User {
  id: string
  username: string
  avatar: string
  avatarUrl: string
}

interface InvitedUsersProps {
  users: User[]
}

export default function InvitedUsers({ users }: InvitedUsersProps) {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
    if (e.currentTarget.parentElement) {
      e.currentTarget.parentElement.textContent = '🧑‍💻';
    }
  };
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3">
      {users.map((user, index) => (
        <div
          key={user.id}
          style={{
            animationDelay: `${index * 75}ms`,
          }}
          className="flex items-center gap-2 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg px-3 py-2 border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5 animate-fade-in-down"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 p-0.5 flex items-center justify-center overflow-hidden flex-shrink-0">
            <div className="h-full w-full rounded-full overflow-hidden bg-background flex items-center justify-center">
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.username} 
                  className="h-full w-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <span>{user.avatar || '🧑‍💻'}</span>
              )}
            </div>
          </div>
          <span className="font-semibold truncate bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {user.username}
          </span>
        </div>
      ))}
    </div>
  )
}

/* Add this to your global CSS file if not already present
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fadeInDown 0.5s ease-out forwards;
}
*/

