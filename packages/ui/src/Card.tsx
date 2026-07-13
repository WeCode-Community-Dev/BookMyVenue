import React from 'react'
import { cn } from './lib/utils'

type CardProps = {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return <div className={cn('card bg-white dark:bg-ink-900 border border-zinc-200 dark:border-ink-700 rounded-xl shadow-sm', className)}>{children}</div>
}