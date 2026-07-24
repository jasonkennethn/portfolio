'use client';

import React from 'react';

interface DisplayViewportWrapperProps {
  children: React.ReactNode;
}

export function DisplayViewportWrapper({ children }: DisplayViewportWrapperProps) {
  return (
    <div className="w-full h-full flex-1 flex flex-col overflow-hidden">
      {children}
    </div>
  );
}
