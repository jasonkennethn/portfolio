'use client';

import React from 'react';
import { Navbar } from '@/components/Navbar';
import { DisplayViewportWrapper } from '@/components/DisplayViewportWrapper';
import { BlankCanvas } from '@/components/BlankCanvas';

export default function Home() {
  return (
    <div className="h-dvh w-full overflow-hidden flex flex-col justify-between bg-executive-mesh text-[#020617] fixed inset-0">
      {/* Top Floating Navbar */}
      <Navbar />

      {/* Main Responsive Portfolio Content */}
      <main className="flex-1 w-full overflow-hidden flex flex-col relative">
        <DisplayViewportWrapper>
          <BlankCanvas />
        </DisplayViewportWrapper>
      </main>
    </div>
  );
}
