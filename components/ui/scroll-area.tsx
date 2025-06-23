"use client"

import React from "react"

export function ScrollArea({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`overflow-y-auto ${className}`} style={{ scrollbarWidth: "thin" }}>
      {children}
    </div>
  )
}
