import { useState, useRef, useEffect } from 'react'
import { INDIAN_STATES } from '../lib/constants'
import { ChevronDown } from 'lucide-react'

interface StateSelectProps {
  value: string
  onChange: (value: string) => void
}

export function StateSelect({ value, onChange }: StateSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="space-y-1 relative" ref={dropdownRef}>
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600">
        State<span className="text-red-500 ml-1">*</span>
      </label>
      
      {/* Hidden input so forms still work via FormData if needed */}
      <input type="hidden" name="state" value={value} required />

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-10 px-3 py-2 bg-white dark:bg-ink-900 rounded-md border border-zinc-200 dark:border-ink-800 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand text-left"
      >
        <span className={value ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400 dark:text-zinc-500'}>
          {value || 'Select a state…'}
        </span>
        <ChevronDown className={`h-4 w-4 text-zinc-400 dark:text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-ink-900 border border-zinc-200 dark:border-ink-800 rounded-md shadow-lg max-h-[220px] overflow-y-auto">
          {INDIAN_STATES.map((state) => (
            <div
              key={state}
              onClick={() => {
                onChange(state)
                setIsOpen(false)
              }}
              className={`px-3 py-2 cursor-pointer text-sm hover:bg-brand/5 hover:text-brand ${
                value === state ? 'bg-brand/10 text-brand font-medium' : 'text-zinc-700 dark:text-zinc-300 dark:text-zinc-600'
              }`}
            >
              {state}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
