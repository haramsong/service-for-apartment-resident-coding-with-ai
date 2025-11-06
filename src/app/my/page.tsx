"use client";

import {
  User,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Camera,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    category: "계정",
    items: [
      { icon: User, label: "프로필 관리", href: "/my/profile" },
      { icon: Bell, label: "알림 설정", href: "/my/notifications" },
      { icon: Settings, label: "환경 설정", href: "/my/settings" },
    ],
  },
  {
    category: "지원",
    items: [{ icon: HelpCircle, label: "고객센터", href: "/my/support" }],
  },
];

export default function MyPage() {
  const router = useRouter();
  const supabase = createClient();
  const { data: profile, refetch } = trpc.auth.getProfile.useQuery();
  const { data: stats, isLoading } = trpc.user.getActivityStats.useQuery();
  const updateAvatar = trpc.user.updateAvatar.useMutation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile?.avatar || null
  );

  useEffect(() => {
    if (profile?.avatar) {
      setAvatarUrl(profile.avatar);
    }
  }, [profile?.avatar]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/signin");
    router.refresh();
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 제한 (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("이미지 크기는 2MB 이하여야 합니다.");
      return;
    }

    // 이미지 타입 확인
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    setUploading(true);
    try {
      // 이미지 압축
      const compressedFile = await compressImage(file);

      const formData = new FormData();
      formData.append("file", compressedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();

      await updateAvatar.mutateAsync({ avatar: url });
      setAvatarUrl(url); // 즉시 UI 반영
      // 프로필 다시 fetch
      await refetch();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              resolve(new File([blob!], file.name, { type: "image/jpeg" }));
            },
            "image/jpeg",
            0.8
          );
        };
      };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 사용자 정보 */}
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  priority
                  unoptimized={avatarUrl.includes("supabase")}
                />
              ) : (
                <User className="h-8 w-8 text-primary-600" />
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="아바타 변경"
            >
              {uploading ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="h-3 w-3 text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              {profile?.name || "사용자"}
            </h2>
            <p className="text-sm text-gray-500">
              {profile?.dong}동 {profile?.ho}호
            </p>
          </div>
          <Button variant="outline" size="sm">
            프로필 수정
          </Button>
        </div>
      </Card>

      {/* 최근 활동 */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">최근 활동</h2>
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {isLoading ? "-" : stats?.postsCount || 0}
            </div>
            <div className="text-sm text-gray-600">작성한 글</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {isLoading ? "-" : stats?.commentsCount || 0}
            </div>
            <div className="text-sm text-gray-600">댓글</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {isLoading ? "-" : stats?.reservationsCount || 0}
            </div>
            <div className="text-sm text-gray-600">예약</div>
          </Card>
        </div>
      </section>

      {/* 메뉴 */}
      {menuItems.map((section) => (
        <section key={section.category}>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            {section.category}
          </h2>
          <Card className="divide-y">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </button>
              );
            })}
          </Card>
        </section>
      ))}

      {/* 로그아웃 */}
      <Button
        variant="outline"
        className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        로그아웃
      </Button>
    </div>
  );
}
