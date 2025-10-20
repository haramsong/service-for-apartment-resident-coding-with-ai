import { CalendarCheck, Clock, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const facilities = [
  {
    id: 1,
    name: '헬스장',
    icon: '🏋️',
    hours: '06:00 - 22:00',
    capacity: '20명',
    status: 'available',
  },
  {
    id: 2,
    name: '독서실',
    icon: '📚',
    hours: '24시간',
    capacity: '30명',
    status: 'available',
  },
  {
    id: 3,
    name: '회의실',
    icon: '🏢',
    hours: '09:00 - 21:00',
    capacity: '10명',
    status: 'available',
  },
]

const myReservations = [
  {
    id: 1,
    facility: '헬스장',
    date: '2025-10-22',
    time: '19:00 - 20:00',
    status: '예약완료',
  },
]

export default function ReservationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">시설 예약</h1>
        <p className="text-sm text-gray-500 mt-1">아파트 공용 시설을 예약하세요</p>
      </div>

      {/* 내 예약 현황 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">내 예약 현황</h2>
        <div className="space-y-3">
          {myReservations.map((reservation) => (
            <Card key={reservation.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg font-semibold text-gray-900">{reservation.facility}</span>
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                      {reservation.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <CalendarCheck className="h-4 w-4" />
                      <span>{reservation.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{reservation.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">변경</Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">취소</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 예약 가능한 시설 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">예약 가능한 시설</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilities.map((facility) => (
            <Card key={facility.id} className="p-5 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{facility.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">{facility.name}</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{facility.hours}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>최대 {facility.capacity}</span>
                </div>
              </div>
              <Button className="w-full">예약하기</Button>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
