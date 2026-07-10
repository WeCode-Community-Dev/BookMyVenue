import React, { useState, useEffect } from 'react'
import { InfoTooltip } from '@venue404/ui'

export interface DurationInputProps {
  label: string
  name: string
  value?: number | string
  defaultValue?: number | string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  helperText?: string
  info?: React.ReactNode
}

export function DurationInput({ label, name, value, defaultValue, onChange, required, helperText, info }: DurationInputProps) {
  const [hours, setHours] = useState<string>('')
  const [minutes, setMinutes] = useState<string>('')

  // Initialize from value or defaultValue
  useEffect(() => {
    const val = value !== undefined ? value : defaultValue
    if (val !== undefined && val !== '') {
      const totalMin = Number(val)
      if (!isNaN(totalMin)) {
        setHours(Math.floor(totalMin / 60).toString() || '0')
        setMinutes((totalMin % 60).toString() || '0')
      }
    }
  }, [value, defaultValue])

  const totalMinutes = (Number(hours) || 0) * 60 + (Number(minutes) || 0)

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHours = e.target.value
    if (value === undefined) {
      setHours(newHours)
    }
    if (onChange) {
      onChange({ target: { name, value: (Number(newHours) || 0) * 60 + (Number(minutes) || 0), type: 'number' } } as unknown as React.ChangeEvent<HTMLInputElement>)
    }
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMinutes = e.target.value
    if (value === undefined) {
      setMinutes(newMinutes)
    }
    if (onChange) {
      onChange({ target: { name, value: (Number(hours) || 0) * 60 + (Number(newMinutes) || 0), type: 'number' } } as unknown as React.ChangeEvent<HTMLInputElement>)
    }
  }

  return (
    <div className="space-y-1">
      <label className="flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {info && <InfoTooltip content={info} />}
      </label>
      <input type="hidden" name={name} value={totalMinutes} required={required} />
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center border border-zinc-200 dark:border-ink-800 rounded-md focus-within:ring-2 focus-within:ring-brand/20 focus-within:border-brand bg-white dark:bg-ink-900 h-10 w-full transition-shadow overflow-hidden">
          <input 
            type="number" 
            min="0" 
            className="w-full focus:outline-none bg-transparent border-none focus:ring-0 pl-3 shadow-none h-full" 
            placeholder="0"
            value={hours}
            onChange={handleHoursChange}
          />
          <span className="text-zinc-500 dark:text-zinc-400 text-sm select-none font-medium border-l border-zinc-200 dark:border-ink-800 px-3 h-full flex items-center bg-zinc-50 dark:bg-ink-950/50">hrs</span>
        </div>
        <div className="flex items-center border border-zinc-200 dark:border-ink-800 rounded-md focus-within:ring-2 focus-within:ring-brand/20 focus-within:border-brand bg-white dark:bg-ink-900 h-10 w-full transition-shadow overflow-hidden">
          <input 
            type="number" 
            min="0" 
            max="59"
            className="w-full focus:outline-none bg-transparent border-none focus:ring-0 pl-3 shadow-none h-full" 
            placeholder="0"
            value={minutes}
            onChange={handleMinutesChange}
          />
          <span className="text-zinc-500 dark:text-zinc-400 text-sm select-none font-medium border-l border-zinc-200 dark:border-ink-800 px-3 h-full flex items-center bg-zinc-50 dark:bg-ink-950/50">mins</span>
        </div>
      </div>
      {helperText && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{helperText}</p>}
    </div>
  )
}
