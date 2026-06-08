import React from 'react';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
export function Modal({ isOpen, onClose, children }: Props) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&times;</button>
        {children}
      </div>
    </div>
  );
}