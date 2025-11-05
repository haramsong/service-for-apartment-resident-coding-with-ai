'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { trpc } from '@/lib/trpc/client'
import { Clock } from 'lucide-react'

interface ReservationDialogProps {
  facility: {
    id: string
    name: string
    operatingHours?: { start: string; end: string } | null
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReservationDialog({ facility, open, onOpenChange }: ReservationDialogProps) {
  const [date, setDate] = useState<Date>()
  const [selectedSlot, setSelectedSlot] = useState<{ start: string; end: string } | null>(null)

  const utils = trpc.useUtils()

  const { data: slotsData } = trpc.reservations.getAvailableSlots.useQuery(
    {
      facilityId: facility.id,
      date: date?.toISOString().split('T')[0] || '',
    },
    { enabled: !!date }
  )

  const createReservation = trpc.reservations.create.useMutation({
    onSuccess: () => {
      utils.reservations.getMyList.invalidate()
      onOpenChange(false)
      setDate(undefined)
      setSelectedSlot(null)
    },
  })

  const handleReserve = () => {
    if (!date || !selectedSlot) return

    createReservation.mutate({
      facilityId: facility.id,
      date: date.toISOString().split('T')[0],
      startTime: selectedSlot.start,
      endTime: selectedSlot.end,
    })
  }

  const slots = slotsData?.slots || []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{facility.name} 예약</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 날짜 선택 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">날짜 선택</label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              className="rounded-md border"
            />
          </div>

          {/* 시간 선택 */}
          {date && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">시간 선택</label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {slots.map((slot: any) => (
                  <button
                    key={`${slot.startTime}-${slot.endTime}`}
                    onClick={() =>
                      slot.isAvailable &&
                      setSelectedSlot({ start: slot.startTime, end: slot.endTime })
                    }
                    disabled={!slot.isAvailable}
                    className={`p-3 rounded-lg border text-sm transition-all ${
                      selectedSlot?.start === slot.startTime
                        ? 'bg-primary text-white border-primary'
                        : slot.isAvailable
                        ? 'hover:bg-gray-50 border-gray-200'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 예약 버튼 */}
          <div className="flex space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={handleReserve}
              disabled={!date || !selectedSlot || createReservation.isPending}
              className="flex-1"
            >
              {createReservation.isPending ? '예약 중...' : '예약하기'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
