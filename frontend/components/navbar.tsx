'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth';
import { LogOut, KeyRound, ChevronDown } from 'lucide-react';
import { ChangePasswordModal } from '@/components/change-password-modal';

export function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      <nav className="border-b bg-background sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">Todo App</h1>
          </div>

          <div className="relative" ref={menuRef}>
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="gap-2"
              >
                <span className="text-sm">{user.username}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            )}

            {isMenuOpen && user && (
              <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-10">
                <div className="py-2">
                  <div className="px-4 py-2 text-sm text-muted-foreground border-b">
                    {user.email}
                  </div>

                  <button
                    onClick={() => {
                      setIsPasswordModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                  >
                    <KeyRound className="h-4 w-4" />
                    <span>Change Password</span>
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </>
  );
}


