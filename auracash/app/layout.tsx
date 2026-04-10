import type {Metadata} from 'next';
import './globals.css'; // Global styles
import FlowiseChat from '@/components/FlowiseChat';

export const metadata: Metadata = {
  title: 'AuraCash - AI Financial Management',
  description: 'Intelligent investment approvals and real-time monitoring.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        <FlowiseChat />
      </body>
    </html>
  );
}
