import { useState, useRef, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import type { ChangeEvent } from 'react'
import { ChevronDown, Clock } from 'lucide-react'

import { InfoTooltip } from '@venue404/ui'

interface TimeSelectProps {
  label?: string
  name?: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  helperText?: string
  disabled?: boolean
  info?: string
}

export function TimeSelect({ label, name, value, onChange, required, helperText, disabled, info }: TimeSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Generate 30-min intervals
  const timeOptions = useMemo(() => {
    const options = []
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        // Format for backend (HH:mm:00)
        const hh = h.toString().padStart(2, '0')
        const mm = m.toString().padStart(2, '0')
        const backendValue = `${hh}:${mm}:00`

        // Format for display (hh:mm A)
        const ampm = h >= 12 ? 'PM' : 'AM'
        const displayH = h % 12 === 0 ? 12 : h % 12
        const displayHh = displayH.toString().padStart(2, '0')
        const displayLabel = `${displayHh}:${mm} ${ampm}`

        options.push({ value: backendValue, label: displayLabel })
      }
    }
    return options
  }, [])

  // Find currently selected label
  const selectedOption = timeOptions.find(o => {
    // value could be "09:00", "09:00:00"
    if (!value) return false
    return value.startsWith(o.value.slice(0, 5)) // match "09:00"
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (
        dropdownRef.current && !dropdownRef.current.contains(target) &&
        popoverRef.current && !popoverRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Auto scroll to selected option on open
  useEffect(() => {
    if (isOpen && selectedOption && popoverRef.current) {
      const dropdown = popoverRef.current
      const selectedEl = dropdown?.querySelector('.selected-time') as HTMLElement
      if (dropdown && selectedEl) {
        dropdown.scrollTop = selectedEl.offsetTop - (dropdown.clientHeight / 2) + (selectedEl.clientHeight / 2)
      }
    }
  }, [isOpen, selectedOption])

  const toggleOpen = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
    setIsOpen(!isOpen)
  }

  return (
    <div className="space-y-1 relative" ref={dropdownRef}>
      {label && (
        <label className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 dark:text-zinc-600 mb-1">
          <span>{label}{required && <span className="text-red-500 ml-1">*</span>}</span>
          {info && <InfoTooltip content={info} />}
        </label>
      )}
      
      {/* Hidden input for FormData compatibility */}
      {name && <input type="hidden" name={name} value={value || ''} required={required} />}

      <button
        type="button"
        disabled={disabled}
        onClick={toggleOpen}
        className={`w-full h-10 px-3 py-2 bg-white dark:bg-ink-900 rounded-md border border-zinc-200 dark:border-ink-800 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-brand/20 text-left transition-shadow ${disabled ? 'opacity-50 cursor-not-allowed bg-zinc-50 dark:bg-ink-800' : 'focus:border-brand hover:border-zinc-300 dark:border-ink-700 dark:hover:border-ink-700'}`}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <span className={selectedOption ? 'text-zinc-900 dark:text-zinc-100 font-medium' : 'text-zinc-500 dark:text-zinc-400 dark:text-zinc-500'}>
            {selectedOption ? selectedOption.label : 'Select a time…'}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-zinc-400 dark:text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          ref={popoverRef}
          className="absolute z-[9999] bg-white dark:bg-ink-900 border border-zinc-200 dark:border-ink-800 rounded-md shadow-lg max-h-[260px] overflow-y-auto"
          style={{ top: coords.top, left: coords.left, width: coords.width }}
        >
          {timeOptions.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange({ target: { name, value: opt.value } } as unknown as ChangeEvent<HTMLInputElement>)
                setIsOpen(false)
              }}
              className={`px-3 py-2.5 cursor-pointer text-sm hover:bg-brand/5 hover:text-brand transition-colors ${
                selectedOption?.value === opt.value ? 'selected-time bg-brand/10 text-brand font-semibold' : 'text-zinc-700 dark:text-zinc-300 dark:text-zinc-600'
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>,
        document.body
      )}
      
      {helperText && <p className="text-xs text-zinc-500 dark:text-zinc-400 dark:text-zinc-500 mt-1">{helperText}</p>}
    </div>
  )
}
