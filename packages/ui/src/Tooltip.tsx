import React from 'react'
import { Info } from 'lucide-react'

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <span 
      className="group relative inline-flex items-center justify-center cursor-help pointer-events-auto"
      tabIndex={0}
    >
      {children}
      <div className="invisible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[320px] rounded-md bg-zinc-800 px-3 py-2 text-xs font-normal text-zinc-100 text-center opacity-0 shadow-xl transition-all duration-200 group-hover:visible group-hover:opacity-100 group-hover:-translate-y-1 focus-within:visible focus-within:opacity-100 focus-within:-translate-y-1 z-[99999] pointer-events-none">
        {content}
        {/* Arrow */}
        <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-800"></div>
      </div>
    </span>
  )
}

export function InfoTooltip({ content }: { content: React.ReactNode }) {
  return (
    <Tooltip content={content}>
      <span className="ml-1 inline-flex p-1 -m-1 focus:outline-none">
        <Info className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors" />
      </span>
    </Tooltip>
  )
}
