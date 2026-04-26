"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useResizable } from "./useResizable";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { width, startResizing } = useResizable(256, 160, 480);

  const getActiveTab = () => {
    if (pathname.startsWith("/projects")) return "projects";
    if (pathname.startsWith("/blogs")) return "blogs";
    return "profile";
  };

  const activeTab = getActiveTab();
  const actualWidth = isSidebarOpen ? width : 56;

  const Icons = {
    profile: <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    projects: <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>,
    blogs: <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline strokeLinecap="round" strokeLinejoin="round" points="14 2 14 8 20 8" /><line strokeLinecap="round" strokeLinejoin="round" x1="16" y1="13" x2="8" y2="13" /><line strokeLinecap="round" strokeLinejoin="round" x1="16" y1="17" x2="8" y2="17" /><polyline strokeLinecap="round" strokeLinejoin="round" points="10 9 9 9 8 9" /></svg>
  }

  return (
    <div className="flex h-screen w-full flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-zinc-800 font-sans">
      <div className="flex min-h-0 flex-1 relative">
        <div className="pointer-events-none fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_30%_40%,_rgba(0,0,0,0.03)_0%,_transparent_50%)] dark:bg-[radial-gradient(ellipse_at_30%_40%,_rgba(255,255,255,0.06)_0%,_transparent_50%_,_rgba(0,0,0,0.9)_100%)]" />
        
        <aside 
            className={`shrink-0 bg-[var(--sidebar-bg)] overflow-hidden relative transition-[width] duration-300 ease-in-out hidden sm:flex flex-col border-r border-[var(--border)] z-10`}
            style={{ width: actualWidth }}
        >
          <div style={{ width: actualWidth }} className="h-full flex flex-col relative overflow-hidden transition-opacity duration-300">
            
            {/* Header Replacement -> Global Logo */}
            <div className={`py-[0.55rem] border-b border-[var(--border)] flex items-center h-14 shrink-0 transition-all ${isSidebarOpen ? 'px-4 justify-start gap-4' : 'px-0 justify-center'}`}>
              <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                  className="p-1.5 hover:bg-[var(--surface)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded transition-colors shrink-0" 
                  title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
               >
                 <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M9 3v18" />
                    {isSidebarOpen ? <path d="m16 15-3-3 3-3" /> : <path d="m14 9 3 3-3 3" />}
                 </svg>
              </button>
              {isSidebarOpen && <span className="font-bold tracking-widest text-[0.8rem] opacity-90 truncate mt-0.5">BASHNEKO</span>}
            </div>

            <nav className="whitespace-nowrap flex-1 overflow-y-auto overflow-x-hidden py-3 flex flex-col gap-0.5">
              {['profile', 'projects', 'blogs'].map((tab) => {
                const isActive = activeTab === tab;
                const pathTarget = tab === 'profile' ? '/' : `/${tab}`;
                return (
                  <Link 
                     key={tab}
                     href={pathTarget} 
                     className={`sidebar-nav-item flex h-11 w-full items-center transition-all duration-150 decoration-transparent hover:no-underline ${isSidebarOpen ? 'px-4 justify-between' : 'justify-center border-b-0'}`} 
                     style={{ 
                        background: isActive ? "var(--sidebar-active)" : "transparent", 
                        color: isActive ? "var(--foreground)" : "var(--muted-foreground)" 
                     }}
                  >
                     <div className="flex items-center gap-3">
                        {Icons[tab as keyof typeof Icons]}
                        {isSidebarOpen && <span className="capitalize text-[0.8rem] font-medium">{tab}</span>}
                     </div>
                     {isSidebarOpen && isActive && <span className="h-1.5 w-1.5 rounded-none" style={{ background: "var(--dot-generated)" }} />}
                  </Link>
                );
              })}
            </nav>
            
            <div className="mt-auto border-t border-[var(--border)] py-2 flex flex-col gap-0.5 shrink-0 whitespace-nowrap">
               <a 
                 className={`flex items-center gap-3 h-10 transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)] ${isSidebarOpen ? 'px-4 justify-start' : 'justify-center'}`} 
                 href="mailto:hello@example.com"
                 title="Contact"
               >
                 <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                 </svg>
                 {isSidebarOpen && <span className="text-[0.8rem] font-medium">Contact</span>}
               </a>
            </div>

            {isSidebarOpen && <div className="w-2 cursor-col-resize absolute right-0 top-0 bottom-0 z-20 hover:bg-[var(--foreground)] opacity-0 hover:opacity-10 transition-opacity" onMouseDown={startResizing} />}
          </div>
        </aside>
        
        {children}
      </div>
    </div>
  );
}
