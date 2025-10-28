'use client';

import dynamic from 'next/dynamic';

// BlockNote requires client-side only rendering
const NotesAI = dynamic(() => import('./components/NotesAI'), {
  ssr: false,
});

export default function Home() {
  return <NotesAI />;
}
