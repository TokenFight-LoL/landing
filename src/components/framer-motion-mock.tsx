import type React from "react"

export const motion = {
  div: (props: any) => <div {...props} />,
}

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>

