import type { Metadata, Viewport } from "next";
import "./globals.css";
import "react-day-picker/dist/style.css";
import TopNavigation from "@/components/layout/TopNavigation";
import BottomNavigation from "@/components/layout/BottomNavigation";
import AuthSessionProvider from "@/components/providers/session-provider";
import AuthProvider from "@/components/providers/auth-provider";
import { TRPCProvider } from "@/lib/trpc/provider";

const APP_NAME = "우리동네";
const APP_DEFAULT_TITLE = "우리동네";
const APP_TITLE_TEMPLATE = "%s - 아파트 커뮤니티";
const APP_DESCRIPTION = "아파트 입주민을 위한 소통 플랫폼";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
