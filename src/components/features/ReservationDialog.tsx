"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { trpc } from "@/lib/trpc/client";
import { Clock } from "lucide-react";

interface ReservationDialogProps {
  facility: {
    id: string;
    name: string;
    operatingHours?: { start: string; end: string } | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReservationDialog({
  facility,
  open,
  onOpenChange,
}: ReservationDialogProps) {
  const [date, setDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<{
    start: string;
    end: string;
  } | null>(null);

  const utils = trpc.useUtils();

  const { data: slotsData } = trpc.reservations.getAvailableSlots.useQuery(
    {
      facilityId: facility.id,
      date: date?.toISOString().split("T")[0] || "",
    },
    { enabled: !!date }
  );

  const createReservation = trpc.reservations.create.useMutation({
    onSuccess: () => {
      utils.reservations.getMyList.invalidate();
      onOpenChange(false);
      setDate(undefined);
      setSelectedSlot(null);
    },
  });

  const handleReserve = () => {
    if (!date || !selectedSlot) return;

    createReservation.mutate({
      facilityId: facility.id,
      date: date.toISOString().split("T")[0],
      startTime: selectedSlot.start,
      endTime: selectedSlot.end,
    });
  };

  const slots = slotsData?.slots || [];

  // 날짜 제한 로직
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30); // 30일 이내만 예약 가능

  const isDateDisabled = (checkDate: Date) => {
    const dateOnly = new Date(checkDate);
    dateOnly.setHours(0, 0, 0, 0);
    return dateOnly < today || dateOnly > maxDate;
  };

  // 시간 제한 로직 (오늘 날짜인 경우 현재 시간 이후만 선택 가능)
  const isSlotAvailable = (slot: any) => {
    if (!slot.isAvailable) return false;
    if (!date) return false;

    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    // 오늘이 아니면 모든 시간 선택 가능
    if (selectedDate.getTime() !== todayDate.getTime()) return true;

    // 오늘인 경우 현재 시간 이후만 선택 가능
    const now = new Date();
    const [startHour, startMinute] = slot.startTime.split(":").map(Number);
    const slotTime = new Date();
    slotTime.setHours(startHour, startMinute, 0, 0);

    return slotTime > now;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {facility.name} 예약
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 날짜 선택 */}
          <div>
            <label className="text-sm font-semibold text-gray-900 mb-3 block">
              날짜 선택 (30일 이내)
            </label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={isDateDisabled}
              className="rounded-xl border border-gray-200 bg-white shadow-sm"
            />
          </div>

          {/* 시간 선택 */}
          {date && (
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-3 block">
                시간 선택
                {new Date(date).setHours(0, 0, 0, 0) ===
                  new Date().setHours(0, 0, 0, 0) && (
                  <span className="text-xs text-gray-500 ml-2">
                    (현재 시간 이후만 선택 가능)
                  </span>
                )}
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-1">
                {slots.map((slot: any) => {
                  const available = isSlotAvailable(slot);
                  const showCapacity = slot.capacity && slot.capacity > 1;
                  return (
                    <button
                      key={`${slot.startTime}-${slot.endTime}`}
                      onClick={() =>
                        available &&
                        setSelectedSlot({
                          start: slot.startTime,
                          end: slot.endTime,
                        })
                      }
                      disabled={!available}
                      className={`p-4 rounded-xl border-2 text-sm font-medium transition-all min-h-[56px] ${
                        selectedSlot?.start === slot.startTime
                          ? "bg-[#2B5CE6] text-white border-[#2B5CE6] shadow-md"
                          : available
                          ? "hover:bg-blue-50 hover:border-[#2B5CE6] border-gray-200 text-gray-700"
                          : "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <div className="flex items-center space-x-1.5">
                          <Clock className="h-4 w-4" />
                          <span>
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        {showCapacity && (
                          <span className="text-xs">
                            {slot.currentCount}/{slot.capacity}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 예약 버튼 */}
          <div className="flex space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 text-base font-semibold border-2"
            >
              취소
            </Button>
            <Button
              onClick={handleReserve}
              disabled={!date || !selectedSlot || createReservation.isPending}
              className="flex-1 h-12 text-base font-semibold bg-[#2B5CE6] hover:bg-[#1E4BD1]"
            >
              {createReservation.isPending ? "예약 중..." : "예약하기"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
