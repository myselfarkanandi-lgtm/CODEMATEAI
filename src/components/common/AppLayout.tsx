import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header.tsx';
import { Sidebar } from './Sidebar.tsx';
import { Background3D } from './Background3D.tsx';

export const AppLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#050816] text-[#F8FAFC]">
      {/* Subtle 3D WebGL background */}
      <Background3D opacity={0.35} interactive={false} />

      {/* Desktop Sidebar */}
      <div className="relative z-20 hidden lg:block lg:shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-50 flex w-64 max-w-xs flex-1 flex-col shadow-2xl">
            <Sidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <Header onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};
