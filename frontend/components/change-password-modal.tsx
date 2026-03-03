'use client';

import { useRef } from 'react';
import { ChangePasswordForm } from '@/components/change-password-form';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  if (!isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <dialog
        ref={dialogRef}
        open={isOpen}
        className="rounded-lg bg-background p-6 shadow-lg max-w-md w-full mx-4"
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Change Password</h2>
            <p className="text-sm text-muted-foreground">
              Enter your current password and choose a new one
            </p>
          </div>

          <ChangePasswordForm
            onSuccess={onClose}
            onCancel={onClose}
          />
        </div>
      </dialog>
    </div>
  );
}
