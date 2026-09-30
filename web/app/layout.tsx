import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loss Insight — 이상탐지 대시보드",
  description: "재료비 로스 이상탐지 · 원가혁신팀",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
