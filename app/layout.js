import './globals.css'

export const metadata = {
  title: 'أنزلي - لعبة المسابقات',
  description: 'لعبة المسابقات الجماعية',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
