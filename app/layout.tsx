import type { Metadata } from 'next';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/react/style.css';
import '../src/styles/App.css';
import '../src/styles/index.css';

export const metadata: Metadata = {
  title: 'NotesAI - AI-Powered Note Taking',
  description:
    'A modern AI-powered note-taking application with BlockNote editor',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/notesai-favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
