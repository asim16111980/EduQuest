import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-gray-700 mb-2 font-body">{label}</label>
      <input
        className={`
          w-full px-4 py-3 rounded-xl border-2 bg-white text-gray-800 font-body
          transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1.5 text-sm text-red-500 font-body">{error}</p>}
    </div>
  )
}
