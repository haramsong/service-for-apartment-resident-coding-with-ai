import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 첫 번째 아파트 찾기
  const apartment = await prisma.apartment.findFirst()

  if (!apartment) {
    console.log('아파트가 없습니다. 먼저 아파트를 생성해주세요.')
    return
  }

  console.log(`아파트: ${apartment.name}에 시설 추가 중...`)

  const facilities = [
    {
      name: '헬스장',
      description: '최신 운동 기구가 구비된 헬스장입니다.',
      capacity: 20,
      operatingHours: {
        start: '06:00',
        end: '22:00',
      },
      apartmentId: apartment.id,
    },
    {
      name: '독서실',
      description: '조용한 환경에서 공부할 수 있는 독서실입니다.',
      capacity: 30,
      operatingHours: {
        start: '00:00',
        end: '24:00',
      },
      apartmentId: apartment.id,
    },
    {
      name: '회의실',
      description: '소규모 모임이나 회의를 위한 공간입니다.',
      capacity: 10,
      operatingHours: {
        start: '09:00',
        end: '21:00',
      },
      apartmentId: apartment.id,
    },
    {
      name: '골프연습장',
      description: '실내 골프 연습장입니다.',
      capacity: 4,
      operatingHours: {
        start: '07:00',
        end: '22:00',
      },
      apartmentId: apartment.id,
    },
  ]

  for (const facility of facilities) {
    const existing = await prisma.facility.findFirst({
      where: {
        name: facility.name,
        apartmentId: apartment.id,
      },
    })

    if (!existing) {
      await prisma.facility.create({
        data: facility,
      })
      console.log(`✅ ${facility.name} 추가 완료`)
    } else {
      console.log(`⏭️  ${facility.name} 이미 존재함`)
    }
  }

  console.log('시설 데이터 추가 완료!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
