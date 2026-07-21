import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { format, parse } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { InfoTooltip } from './Tooltip'

export interface DatePickerProps {
  value?: string // format: YYYY-MM-DD
  onChange?: (value: string) => void
  label?: string
  required?: boolean
  name?: string
  className?: string
  info?: string
}

export default function DatePicker({ value, onChange, label, required, name, className = '', info }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)

  const selectedDate = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined

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
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setCoords({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX
      })
    }
    setIsOpen(!isOpen)
  }

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange?.(format(date, 'yyyy-MM-dd'))
    } else {
      onChange?.('')
    }
    setIsOpen(false)
  }

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {label && (
        <label className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
          <span>{label} {required && <span className="text-red-500">*</span>}</span>
          {info && <InfoTooltip content={info} />}
        </label>
      )}
      
      {name && <input type="hidden" name={name} value={value || ''} />}
      
      <button
        type="button"
        onClick={toggleOpen}
        className="w-full h-10 px-3 flex items-center justify-between rounded-md border border-zinc-200 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-zinc-300 dark:hover:border-ink-700 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-colors text-sm text-zinc-700 dark:text-zinc-100"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <span>{selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Pick a date'}</span>
        </div>
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div 
          ref={popoverRef}
          className="absolute z-[9999] bg-white dark:bg-ink-900 rounded-xl border border-zinc-200 dark:border-ink-800 shadow-xl p-3 animate-in fade-in zoom-in-95 duration-200"
          style={{ top: coords.top, left: coords.left }}
        >
          <style>{`
            .rdp-root {
              --rdp-accent-color: #047857;
              --rdp-background-color: #d1fae5;
            }
          `}</style>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
          />
        </div>,
        document.body
      )}
    </div>
  )
}
