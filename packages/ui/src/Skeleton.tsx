import React from 'react'

type SkeletonProps = {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className = '', style }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-zinc-200/70 rounded-md ${className}`}
      style={style}
    />
  )
}
