import React from 'react';
export function Button({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition disabled:bg-gray-400 ${className}`} {...props}>
      {children}
    </button>
  );
}