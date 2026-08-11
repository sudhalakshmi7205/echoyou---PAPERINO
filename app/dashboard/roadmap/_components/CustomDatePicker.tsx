'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, AlertCircle, Calendar as CalendarIcon } from 'lucide-react'

interface CustomDatePickerProps {
  selectedDate: string // YYYY-MM-DD
  onChange: (dateStr: string, isValid: boolean) => void
  disabled?: boolean
}

export default function CustomDatePicker({ selectedDate, onChange, disabled }: CustomDatePickerProps) {
  // Compute today's date in user's local timezone (at 00:00:00)
  const getTodayLocalDate = () => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }

  const todayDate = getTodayLocalDate()
  const todayYear = todayDate.getFullYear()
  const todayMonth = todayDate.getMonth() // 0-indexed
  const todayDay = todayDate.getDate()

  // Parse currently selected date safely
  const parseSelected = (str: string) => {
    if (!str) return getTodayLocalDate()
    const parts = str.split('-')
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      const d = new Date(year, month, day)
      d.setHours(0, 0, 0, 0)
      return isNaN(d.getTime()) ? getTodayLocalDate() : d
    }
    const d = new Date(str)
    d.setHours(0, 0, 0, 0)
    return isNaN(d.getTime()) ? getTodayLocalDate() : d
  }

  const parsedSelected = parseSelected(selectedDate)

  // Current view year & month state for calendar view navigation
  const [viewYear, setViewYear] = useState<number>(parsedSelected.getFullYear())
  const [viewMonth, setViewMonth] = useState<number>(parsedSelected.getMonth())

  // Ensure view date is at least current month/year
  if (viewYear < todayYear || (viewYear === todayYear && viewMonth < todayMonth)) {
    setViewYear(todayYear)
    setViewMonth(todayMonth)
  }

  // Format date to ISO YYYY-MM-DD
  const formatISO = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  // Format date to human friendly format e.g. "Sunday, 28 July 2026"
  const formatHumanFriendly = (d: Date) => {
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Check if selected date is in the past
  const isPastDate = parsedSelected < todayDate

  const handleSelectDay = (dayNum: number) => {
    const candidate = new Date(viewYear, viewMonth, dayNum)
    candidate.setHours(0, 0, 0, 0)
    if (candidate < todayDate) {
      onChange(formatISO(candidate), false)
    } else {
      onChange(formatISO(candidate), true)
    }
  }

  // Month navigation handlers
  const canGoPrevMonth = viewYear > todayYear || (viewYear === todayYear && viewMonth > todayMonth)
  const handlePrevMonth = () => {
    if (!canGoPrevMonth) return
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  // Generate years list (Current Year onwards, max +10 years)
  const yearOptions: number[] = []
  for (let y = todayYear; y <= todayYear + 10; y++) {
    yearOptions.push(y)
  }

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Calculate days for the calendar grid
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay() // 0 = Sunday
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const daysGrid: (number | null)[] = []
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysGrid.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysGrid.push(d)
  }

  return (
    <div className="space-y-4 max-w-md">
      {/* Calendar Card */}
      <div className="bg-[#111620] border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
        
        {/* Header: Month & Year Controls */}
        <div className="flex items-center justify-between gap-1 sm:gap-2 mb-4 pb-3 border-b border-white/10">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={!canGoPrevMonth || disabled}
            className={`p-1.5 sm:p-2 rounded-xl transition-all shrink-0 ${
              canGoPrevMonth && !disabled
                ? 'bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white'
                : 'bg-white/5 text-gray-600 cursor-not-allowed'
            }`}
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex items-center gap-1 sm:gap-2 min-w-0 max-w-full overflow-hidden">
            {/* Month Select */}
            <select
              value={viewMonth}
              disabled={disabled}
              onChange={(e) => {
                const newMonth = parseInt(e.target.value, 10)
                if (viewYear === todayYear && newMonth < todayMonth) return
                setViewMonth(newMonth)
              }}
              className="bg-[#1a1f2e] border border-white/10 text-white font-bold text-xs sm:text-sm rounded-xl px-2 sm:px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer max-w-[110px] sm:max-w-none truncate"
            >
              {monthNames.map((name, idx) => {
                const isDisabledMonth = viewYear === todayYear && idx < todayMonth
                return (
                  <option key={name} value={idx} disabled={isDisabledMonth}>
                    {name} {isDisabledMonth ? '(Passed)' : ''}
                  </option>
                )
              })}
            </select>

            {/* Year Select */}
            <select
              value={viewYear}
              disabled={disabled}
              onChange={(e) => {
                const newYear = parseInt(e.target.value, 10)
                setViewYear(newYear)
                if (newYear === todayYear && viewMonth < todayMonth) {
                  setViewMonth(todayMonth)
                }
              }}
              className="bg-[#1a1f2e] border border-white/10 text-white font-bold text-xs sm:text-sm rounded-xl px-1.5 sm:px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer shrink-0"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            disabled={disabled}
            className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white transition-all shrink-0"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 mb-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {daysGrid.map((dayNum, index) => {
            if (dayNum === null) {
              return <div key={`empty-${index}`} className="h-10" />
            }

            const cellDate = new Date(viewYear, viewMonth, dayNum)
            cellDate.setHours(0, 0, 0, 0)

            const isDisabledDay = cellDate < todayDate
            const isToday = cellDate.getTime() === todayDate.getTime()
            const isSelected =
              parsedSelected.getFullYear() === viewYear &&
              parsedSelected.getMonth() === viewMonth &&
              parsedSelected.getDate() === dayNum

            return (
              <button
                key={`day-${dayNum}`}
                type="button"
                disabled={isDisabledDay || disabled}
                onClick={() => handleSelectDay(dayNum)}
                className={`h-10 rounded-xl font-medium text-sm transition-all flex flex-col items-center justify-center relative ${
                  isDisabledDay
                    ? 'text-gray-600 bg-white/[0.02] cursor-not-allowed opacity-40 line-through'
                    : isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold shadow-[0_0_15px_rgba(138,92,255,0.4)] ring-2 ring-cyan-400'
                    : isToday
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 font-bold hover:bg-purple-500/30'
                    : 'bg-[#1a1f2e] text-gray-200 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                <span>{dayNum}</span>
                {isToday && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute bottom-1" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Manual Date Input & Formatting Preview */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Selected Date
        </label>
        <div className="relative">
          <input
            type="date"
            min={formatISO(todayDate)}
            value={formatISO(parsedSelected)}
            disabled={disabled}
            onChange={(e) => {
              const val = e.target.value
              if (!val) return
              const parts = val.split('-')
              const candidate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
              candidate.setHours(0, 0, 0, 0)

              // Update calendar view
              setViewYear(candidate.getFullYear())
              setViewMonth(candidate.getMonth())

              if (candidate < todayDate) {
                onChange(val, false)
              } else {
                onChange(val, true)
              }
            }}
            className={`w-full bg-[#1a1f2e] border rounded-xl px-4 py-3 text-white font-semibold focus:outline-none transition-all [&::-webkit-calendar-picker-indicator]:filter-[invert(1)] ${
              isPastDate
                ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                : 'border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500'
            }`}
          />
        </div>

        {/* Human Friendly Display */}
        {!isPastDate && (
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-2 rounded-xl">
            <CalendarIcon className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{formatHumanFriendly(parsedSelected)}</span>
          </div>
        )}

        {/* Validation Alert */}
        {isPastDate && (
          <div className="flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-xl">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>Learning start date cannot be in the past. Please choose today or a future date.</span>
          </div>
        )}
      </div>
    </div>
  )
}
