import type { Metadata } from "next";
import "./globals.css";
import "react-day-picker/dist/style.css";
import TopNavigation from "@/components/layout/TopNavigation";
import BottomNavigation from "@/components/layout/BottomNavigation";
import AuthSessionProvider from "@/components/providers/session-provider";
import AuthProvider from "@/components/providers/auth-provider";
import { TRPCProvider } from "@/lib/trpc/provider";

export const metadata: Metadata = {
  title: "우리동네 - 아파트 커뮤니티",
  description: "아파트 입주민을 위한 소통 플랫폼",
  manifest: "/manifest.json",
  themeColor: "#2B5CE6",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "우리동네",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <AuthSessionProvider>
          <TRPCProvider>
            <AuthProvider>
              <div className="min-h-screen bg-gray-50">
                <TopNavigation />
                <main className="pb-16 md:pb-0">{children}</main>
                <BottomNavigation />
              </div>
            </AuthProvider>
          </TRPCProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
