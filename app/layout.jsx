import './globals.css';

export const viewport = {
  themeColor: '#4F46E5',
};

export const metadata = {
  title: 'ConsultHub — FSKTM Consultation Booking',
  description: 'FSKTM Student Consultation Booking System for managing consultation appointments between students and lecturers.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-512.jpg',
    apple: '/icons/icon-512.jpg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
