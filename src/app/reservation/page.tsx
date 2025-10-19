'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CalendarCheck, 
  Clock, 
  Users, 
  MapPin,
  ChevronRight
} from 'lucide-react'

export default function ReservationPage() {
  const facilities = [
    {
      id: 1,
      name: '피트니스센터',
      description: '최신 운동기구 완비',
      available: true,
      nextSlot: '14:00 - 15:00',
      capacity: '최대 20명',
      location: '지하 1층',
      image: '🏋️‍♂️'
    },
    {
      id: 2,
      name: '독서실',
      description: '조용한 학습 공간',
      available: true,
      nextSlot: '09:00 - 12:00',
      capacity: '최대 30명',
      location: '2층',
      image: '📚'
    },
    {
      id: 3,
      name: '회의실',
      description: '소규모 모임 공간',
      available: false,
      nextSlot: '16:00 - 17:00',
      capacity: '최대 10명',
      location: '1층',
      image: '🏢'
    },
    {
      id: 4,
      name: '게스트하우스',
      description: '방문객 숙박 시설',
      available: true,
      nextSlot: '내일 15:00',
      capacity: '최대 4명',
      location: '별관',
      image: '🏠'
    }
  ]

  const myReservations = [
    {
      id: 1,
      facility: '피트니스센터',
      date: '2025-10-20',
      time: '10:00 - 11:00',
      status: 'confirmed'
    },
    {
      id: 2,
      facility: '독서실',
      date: '2025-10-22',
      time: '14:00 - 17:00',
      status: 'pending'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="w-full max-w-sm mx-auto px-4 py-6 space-y-6 sm:max-w-2xl sm:px-6 md:max-w-4xl md:px-8 lg:max-w-6xl lg:px-12">
        
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">시설 예약</h1>
          <p className="text-gray-600 mt-1">아파트 공용시설을 예약하세요</p>
        </div>

        {/* 내 예약 현황 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">내 예약 현황</h2>
          <div className="space-y-3">
            {myReservations.map((reservation) => (
              <Card key={reservation.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{reservation.facility}</h3>
                      <Badge 
                        className={
                          reservation.status === 'confirmed' 
                            ? 'bg-green-50 text-green-600 border-green-200'
                            : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                        }
                      >
                        {reservation.status === 'confirmed' ? '확정' : '대기'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <CalendarCheck className="h-4 w-4" />
                        <span>{reservation.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{reservation.time}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 예약 가능한 시설 */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">예약 가능한 시설</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {facilities.map((facility) => (
              <Card key={facility.id} className="group overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{facility.image}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{facility.name}</h3>
                        <Badge 
                          className={
                            facility.available 
                              ? 'bg-green-50 text-green-600 border-green-200'
                              : 'bg-red-50 text-red-600 border-red-200'
                          }
                        >
                          {facility.available ? '예약가능' : '예약불가'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{facility.description}</p>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>다음 가능: {facility.nextSlot}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{facility.capacity}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{facility.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    disabled={!facility.available}
                    variant={facility.available ? "default" : "secondary"}
                  >
                    {facility.available ? '예약하기' : '예약불가'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
