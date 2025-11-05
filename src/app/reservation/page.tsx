'use client'

import { useState } from 'react'
import { CalendarCheck, Clock, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/client'
import { useSession } from 'next-auth/react'
import { ReservationDialog } from '@/components/features/ReservationDialog'
import { getKSTDate } from '@/lib/dayjs'

const facilityIcons: Record<string, string> = {
  '헬스장': '🏋️',
  '독서실': '📚',
  '회의실': '🏢',
  '골프연습장': '⛳',
  '수영장': '🏊',
}

export default function ReservationPage() {
  const { data: session } = useSession()
  const apartmentId = session?.user?.apartmentId || ''
  const [selectedFacility, setSelectedFacility] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: facilitiesData, isLoading: facilitiesLoading } = trpc.reservations.getFacilities.useQuery(
    { apartmentId },
    { enabled: !!apartmentId }
  )

  const { data: myReservationsData, isLoading: reservationsLoading } = trpc.reservations.getMyList.useQuery(
    { status: 'confirmed' },
    { enabled: !!session }
  )

  const facilities = facilitiesData?.items || []
  const myReservations = myReservationsData?.items || []

  const handleReserveClick = (facility: any) => {
    setSelectedFacility(facility)
    setDialogOpen(true)
  }

  const formatDate = (date: Date | string) => {
    return getKSTDate(date).format('YYYY.MM.DD')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8">
      {/* 헤더 */}
      <div className="pb-4 border-b border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">시설 예약</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">아파트 공용 시설을 예약하세요</p>
      </div>

      {/* 내 예약 현황 */}
      <section>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">내 예약 현황</h2>
        {reservationsLoading ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">로딩 중...</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {myReservations.length > 0 ? (
              myReservations.map((reservation: any) => (
                <Card key={reservation.id} className="p-4 sm:p-5">
                  <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-base sm:text-lg font-semibold text-gray-900">
                          {reservation.facility.name}
                        </span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                          {reservation.status === 'confirmed' ? '예약완료' : '취소됨'}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <CalendarCheck className="h-4 w-4" />
                          <span>{formatDate(reservation.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{reservation.startTime} - {reservation.endTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-2 sm:pt-0">
                      <Button variant="outline" size="sm" className="flex-1 sm:flex-none min-h-[44px]">
                        변경
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 sm:flex-none min-h-[44px] text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <div className="text-gray-400 mb-2">
                  <CalendarCheck className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500">예약 내역이 없습니다</p>
                <p className="text-sm text-gray-400 mt-1">아래에서 시설을 예약해보세요</p>
              </Card>
            )}
          </div>
        )}
      </section>

      {/* 예약 가능한 시설 */}
      <section>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">예약 가능한 시설</h2>
        {facilitiesLoading ? (
          <Card className="p-8 text-center">
            <p className="text-gray-500">로딩 중...</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities.map((facility: any) => (
              <Card 
                key={facility.id} 
                className="p-5 sm:p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className="text-center mb-4">
                  <div className="text-4xl sm:text-5xl mb-3 group-hover:scale-110 transition-transform duration-200">
                    {facilityIcons[facility.name] || '🏢'}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{facility.name}</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-5">
                  {facility.operatingHours && (
                    <div className="flex items-center justify-center space-x-2">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>
                        {typeof facility.operatingHours === 'object' && facility.operatingHours !== null
                          ? `${facility.operatingHours.start || ''} - ${facility.operatingHours.end || ''}`
                          : '운영시간 미정'}
                      </span>
                    </div>
                  )}
                  {facility.capacity && (
                    <div className="flex items-center justify-center space-x-2">
                      <Users className="h-4 w-4 flex-shrink-0" />
                      <span>최대 {facility.capacity}명</span>
                    </div>
                  )}
                </div>
                <Button className="w-full min-h-[44px] font-medium" onClick={() => handleReserveClick(facility)}>
                  예약하기
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 예약 Dialog */}
      {selectedFacility && (
        <ReservationDialog
          facility={selectedFacility}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </div>
  )
}
