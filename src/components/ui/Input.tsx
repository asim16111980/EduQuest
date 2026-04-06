import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  isRTL?: boolean
}

export function Input({ label, error, className = '', isRTL = false, type: rawType, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = rawType === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : rawType) : rawType

  const iconPosition = isRTL ? 'left-3' : 'right-3'
  const inputPadding = isPassword ? (isRTL ? 'pl-11' : 'pr-11') : ''

  return (
    <div className="mb-4">
      <label className="block text-sm font-bold text-gray-700 mb-2 font-body">{label}</label>
      <div className="relative">
        <input
          type={inputType}
          className={`
            w-full px-4 py-3 rounded-xl border-2 bg-white text-gray-800 font-body
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}
            ${inputPadding}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className={`absolute ${iconPosition} top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors`}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-sm text-red-500 font-body" role="alert">{error}</p>}
    </div>
  )
}
