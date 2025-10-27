import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 아파트 생성
  const apartment = await prisma.apartment.create({
    data: {
      name: '우리아파트',
      address: '서울시 강남구 테헤란로 123',
      totalUnits: 300,
    },
  })

  console.log('✅ 아파트 생성:', apartment.name)

  // 관리자 사용자 생성
  const admin = await prisma.user.create({
    data: {
      email: 'admin@apartment.com',
      name: '관리사무소',
      apartmentId: apartment.id,
      role: 'admin',
    },
  })

  console.log('✅ 관리자 생성:', admin.name)

  // 일반 사용자 생성
  const user = await prisma.user.create({
    data: {
      email: 'user@apartment.com',
      name: '홍길동',
      apartmentId: apartment.id,
      dong: '101',
      ho: '1001',
      role: 'resident',
    },
  })

  console.log('✅ 입주민 생성:', user.name)

  // 공지사항 생성
  const notice = await prisma.notice.create({
    data: {
      apartmentId: apartment.id,
      authorId: admin.id,
      title: '엘리베이터 점검 안내',
      content: '10월 30일 오전 9시부터 12시까지 엘리베이터 정기 점검이 있습니다.',
      category: 'maintenance',
      isUrgent: true,
    },
  })

  console.log('✅ 공지사항 생성:', notice.title)

  // 시설 생성
  const facilities = await prisma.facility.createMany({
    data: [
      {
        apartmentId: apartment.id,
        name: '헬스장',
        description: '최신 운동 기구 완비',
        capacity: 20,
        operatingHours: { open: '06:00', close: '22:00' },
      },
      {
        apartmentId: apartment.id,
        name: '독서실',
        description: '조용한 학습 공간',
        capacity: 30,
        operatingHours: { open: '09:00', close: '21:00' },
      },
      {
        apartmentId: apartment.id,
        name: '회의실',
        description: '입주민 모임 공간',
        capacity: 15,
        operatingHours: { open: '09:00', close: '21:00' },
      },
    ],
  })

  console.log('✅ 시설 생성:', facilities.count, '개')

  // 게시글 생성
  const post = await prisma.post.create({
    data: {
      apartmentId: apartment.id,
      authorId: user.id,
      title: '아이 놀이터 이용 시간 문의',
      content: '놀이터 이용 가능 시간이 언제까지인가요?',
      category: 'question',
    },
  })

  console.log('✅ 게시글 생성:', post.title)

  console.log('\n🎉 시드 데이터 생성 완료!')
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 실패:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
