import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  selectedDate: string
  onSelect: (date: string) => void
  minDate?: string
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function CalendarPicker({ selectedDate, onSelect, minDate }: Props) {
  const initialDate = selectedDate ? new Date(selectedDate) : new Date()
  const [viewDate, setViewDate] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1))

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
  }
  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
  }

  const getDaysInMonthGrid = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    const grid: (string | null)[] = []
    for (let i = 0; i < firstDay; i++) grid.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const m = String(month + 1).padStart(2, '0')
      const day = String(d).padStart(2, '0')
      grid.push(`${year}-${m}-${day}`)
    }
    while (grid.length % 7 !== 0) grid.push(null)
    return grid
  }

  const year1 = viewDate.getFullYear()
  const month1 = viewDate.getMonth()
  const nextMonth = new Date(year1, month1 + 1, 1)
  const year2 = nextMonth.getFullYear()
  const month2 = nextMonth.getMonth()

  const grid1 = getDaysInMonthGrid(year1, month1)
  const grid2 = getDaysInMonthGrid(year2, month2)
  
  const todayStr = new Date().toISOString().split('T')[0]
  
  const label1 = viewDate.toLocaleString('en-IN', { month: 'long', year: 'numeric' })
  const label2 = nextMonth.toLocaleString('en-IN', { month: 'long', year: 'numeric' })

  const renderMonth = (grid: (string | null)[]) => (
    <div className="w-full">
      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map(label => (
          <div key={label} className="text-center text-xs font-medium text-zinc-400 dark:text-zinc-400 py-1">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {grid.map((dateStr, i) => {
          if (!dateStr) return <div key={i} className="h-10" />
          
          const isSelected = dateStr === selectedDate
          const isPast = minDate ? dateStr < minDate : dateStr < todayStr
          
          return (
            <div key={dateStr} className="flex items-center justify-center py-0.5">
              <button
                disabled={isPast}
                onClick={() => onSelect(dateStr)}
                className={`
                  relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors
                  ${isPast ? 'text-zinc-300 dark:text-zinc-600 cursor-not-allowed line-through' : 'hover:bg-brand-50 text-zinc-700 dark:text-zinc-300 cursor-pointer'}
                  ${isSelected ? 'bg-zinc-900 text-white hover:bg-zinc-800' : ''}
                `}
              >
                {parseInt(dateStr.split('-')[2], 10)}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="w-full bg-white dark:bg-ink-900 border border-zinc-200 dark:border-ink-700 rounded-xl p-6 shadow-sm select-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Month 1 */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <button onClick={handlePrevMonth} className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-ink-800 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label1}</span>
            <div className="w-8 h-8 md:hidden">
               {/* Mobile only right arrow */}
               <button onClick={handleNextMonth} className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-ink-800 transition-colors">
                 <ChevronRight className="h-4 w-4" />
               </button>
            </div>
            <div className="w-8 h-8 hidden md:block" />
          </div>
          {renderMonth(grid1)}
        </div>

        {/* Month 2 */}
        <div className="hidden md:block">
          <div className="mb-5 flex items-center justify-between">
            <div className="w-8 h-8" />
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{label2}</span>
            <button onClick={handleNextMonth} className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-ink-800 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          {renderMonth(grid2)}
        </div>
      </div>
      
      <div className="mt-5 flex items-center gap-4 border-t border-zinc-100 dark:border-ink-700 pt-4">
        <span className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-400">
          <span className="h-3.5 w-3.5 rounded-full bg-zinc-900" />
          Selected
        </span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-400">
          <span className="h-3.5 w-3.5 rounded-full bg-zinc-200" />
          Unavailable
        </span>
      </div>
    </div>
  )
}
