import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { APP_CONFIG } from '@/lib/constants';

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
  keywords: APP_CONFIG.keywords,
  authors: [{ name: APP_CONFIG.author }],
  icons: {
    icon: '/favicon.ico',
    apple: '/logo192.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

const antdTheme = {
  token: {
    colorPrimary: '#722ed1',
    borderRadius: 8,
    fontFamily: inter.style.fontFamily,
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 16,
    },
  },
};

export default function RootLayout({ 
  children 
}: Readonly<{ 
  children: React.ReactNode 
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <ConfigProvider
          locale={zhCN}
          theme={antdTheme}
        >
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
