import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Анкета команды',
  description: 'Удобная форма команды с записью в таблицу'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
