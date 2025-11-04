# 알림 상태 관리 통일

*작성일: 2025-11-04*

*작성자: Developer Agent*

## 문제 상황

TopNavigation과 UserHeader 컴포넌트에서 각각 독립적으로 알림 상태를 관리하고 있었습니다.

- TopNavigation: 하드코딩된 알림 표시
- UserHeader: props로 전달받는 notifications 값 사용
- 두 컴포넌트 간 알림 상태 동기화 불가능

## 원인 분석

1. **중복된 상태 관리**: 각 컴포넌트가 독립적으로 알림 상태를 관리
2. **Props Drilling**: 홈페이지에서 UserHeader로 notifications를 전달
3. **확장성 부족**: 알림 기능 추가 시 여러 곳을 수정해야 함

## 해결 방법

### 1. Zustand 스토어 생성

`src/store/useNotificationStore.ts` 파일을 생성하여 전역 알림 상태 관리:

```typescript
import { create } from "zustand";

interface NotificationStore {
  count: number;
  setCount: (count: number) => void;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  count: 3, // 초기값
  setCount: (count) => set({ count }),
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () =>
    set((state) => ({ count: Math.max(0, state.count - 1) })),
  reset: () => set({ count: 0 }),
}));
```

### 2. TopNavigation 수정

```typescript
import { useNotificationStore } from "@/store/useNotificationStore";

export default function TopNavigation() {
  const notificationCount = useNotificationStore((state) => state.count);
  
  // 알림이 있을 때만 배지 표시
  {notificationCount > 0 && (
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full border-2 border-white"></div>
  )}
}
```

### 3. UserHeader 수정

```typescript
import { useNotificationStore } from "@/store/useNotificationStore";

interface UserHeaderProps {
  user: UserInfo;
  // notifications prop 제거
  onNotificationClick?: () => void;
  onSettingsClick?: () => void;
}

export default function UserHeader({ user, onNotificationClick, onSettingsClick }: UserHeaderProps) {
  const notificationCount = useNotificationStore((state) => state.count);
  
  // 스토어에서 가져온 카운트 사용
}
```

### 4. 홈페이지 수정

```typescript
// notificationCount 변수 제거
// UserHeader에 notifications prop 전달하지 않음
<UserHeader 
  user={userInfo}
  onNotificationClick={() => console.log('알림 클릭')}
  onSettingsClick={() => console.log('설정 클릭')}
/>
```

## 예방 방법

1. **전역 상태 관리**: 여러 컴포넌트에서 공유하는 상태는 Zustand 스토어 사용
2. **Props Drilling 최소화**: 깊은 계층 구조에서 props 전달 대신 전역 상태 활용
3. **단일 진실 공급원**: 상태는 한 곳에서만 관리하고 여러 곳에서 구독

## 개선 효과

1. **상태 동기화**: TopNavigation과 UserHeader의 알림 카운트가 자동으로 동기화
2. **코드 간소화**: Props drilling 제거로 코드가 더 깔끔해짐
3. **확장성 향상**: 알림 기능 추가 시 스토어만 수정하면 됨
4. **유지보수 용이**: 알림 관련 로직이 한 곳에 집중됨

## 향후 개선 사항

1. **실시간 알림**: WebSocket이나 Server-Sent Events로 실시간 알림 수신
2. **알림 목록**: 알림 클릭 시 상세 목록 표시
3. **알림 타입**: 긴급, 일반, 시스템 등 알림 타입별 관리
4. **읽음 처리**: 읽은 알림과 읽지 않은 알림 구분
