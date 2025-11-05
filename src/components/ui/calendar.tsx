"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        root: "rdp-root", // 기본 루트
        month: "space-y-4",
        caption_label: "text-base font-semibold text-gray-900",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 w-10 p-0 font-normal hover:bg-blue-50 rounded-lg"
        ),
        selected: "bg-[#2B5CE6] text-white rounded-lg font-medium",
        today:
          "bg-blue-50 text-[#2B5CE6] font-semibold border border-[#2B5CE6]",
        outside: "text-gray-400 opacity-50",
        disabled: "text-gray-300 opacity-50 cursor-not-allowed",
        ...classNames,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
