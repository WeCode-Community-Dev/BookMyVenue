import { useState, useEffect } from 'react'
import { cn } from '../../lib/utils'

type CountdownTimerProps = {
  targetDate: string | Date
  onExpire?: () => void
  className?: string
}

export function CountdownTimer({ targetDate, onExpire, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isExpired: boolean }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  })

  useEffect(() => {
    const target = new Date(targetDate).getTime()

    const intervalId = setInterval(() => {
      const now = new Date().getTime()
      const difference = target - now

      if (difference <= 0) {
        clearInterval(intervalId)
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true })
        if (onExpire) onExpire()
      } else {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        setTimeLeft({ hours, minutes, seconds, isExpired: false })
      }
    }, 1000)

    // Run once immediately
    const now = new Date().getTime()
    const difference = target - now
    if (difference <= 0) {
      clearInterval(intervalId)
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true })
    }

    return () => clearInterval(intervalId)
  }, [targetDate, onExpire])

  if (timeLeft.isExpired) {
    return (
      <span className={cn("text-red-600 font-medium", className)}>
        Expired
      </span>
    )
  }

  const isUrgent = timeLeft.hours < 2

  return (
    <span className={cn("font-medium", isUrgent ? "text-red-600" : "text-amber-600", className)}>
      {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </span>
  )
}
