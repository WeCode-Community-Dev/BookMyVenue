import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  label?: string
  name?: string
}

export default function Select({ options, value, onChange, placeholder = 'Select...', className = '', disabled, label, name }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        containerRef.current && !containerRef.current.contains(target) &&
        popoverRef.current && !popoverRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleOpen = () => {
    if (disabled) return
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
    setIsOpen(!isOpen)
  }

  const selectedOption = options.find(o => o.value === value)

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          {label}
        </label>
      )}
      
      {name && <input type="hidden" name={name} value={value} />}
      
      <button
        type="button"
        disabled={disabled}
        onClick={toggleOpen}
        className={`w-full h-10 px-3 flex items-center justify-between rounded-md border border-zinc-200 dark:border-ink-700 bg-white dark:bg-ink-900 transition-colors text-sm ${
          disabled ? 'opacity-50 cursor-not-allowed bg-zinc-50 dark:bg-ink-800' : 'hover:border-zinc-300 dark:hover:border-ink-600 focus:outline-none focus:ring-2 focus:ring-brand/20'
        }`}
      >
        <span className={selectedOption ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 dark:text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          ref={popoverRef}
          className="absolute z-[9999] bg-white dark:bg-ink-900 rounded-md border border-zinc-200 dark:border-ink-700 shadow-lg py-1 animate-in fade-in zoom-in-95 duration-200 max-h-[300px] overflow-y-auto"
          style={{ top: coords.top, left: coords.left, width: coords.width }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value)
                setIsOpen(false)
              }}
              className={`px-3 py-2 cursor-pointer text-sm transition-colors ${
                value === opt.value ? 'bg-brand text-white font-medium' : 'text-zinc-700 dark:text-zinc-300 hover:bg-brand/5 dark:hover:bg-brand/20 hover:text-brand'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}
