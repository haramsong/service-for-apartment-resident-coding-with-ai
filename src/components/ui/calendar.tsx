'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-4', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center mb-2',
        caption_label: 'text-base font-semibold text-gray-900',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-9 w-9 bg-white p-0 hover:bg-gray-50 border-gray-200'
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-gray-600 rounded-md w-10 font-medium text-sm',
        row: 'flex w-full mt-2',
        cell: 'h-10 w-10 text-center text-sm p-0 relative focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-10 w-10 p-0 font-normal hover:bg-blue-50 rounded-lg transition-colors'
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-[#2B5CE6] text-white hover:bg-[#1E4BD1] focus:bg-[#2B5CE6] rounded-lg font-medium',
        day_today: 'bg-blue-50 text-[#2B5CE6] font-semibold border border-[#2B5CE6]',
        day_outside: 'text-gray-400 opacity-50',
        day_disabled: 'text-gray-300 opacity-50 cursor-not-allowed',
        day_range_middle: 'aria-selected:bg-blue-50 aria-selected:text-[#2B5CE6]',
        day_hidden: 'invisible',
        ...classNames,
      }}
      {...props}
    />
  )
}
Calendar.displayName = 'Calendar'

export { Calendar }
