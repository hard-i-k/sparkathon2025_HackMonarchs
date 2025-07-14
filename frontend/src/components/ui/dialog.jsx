import React from 'react';

export function Dialog({ children }) {
  return <div>{children}</div>;
}

export function DialogTrigger({ children, asChild }) {
  return <div>{children}</div>;
}

export function DialogContent({ children, className }) {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

export function DialogTitle({ children }) {
  return <h2 className="text-lg font-semibold">{children}</h2>;
} 