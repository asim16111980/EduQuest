import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base =
    `inline-flex items-center justify-center font-display font-bold rounded-2xl transition-all duration-300 active:scale-95 select-none cursor-pointer border-0 ${
      disabled || isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-lg'
    }`

  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-200',
    secondary: 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-md shadow-emerald-200',
    outline: 'border-2 border-primary-300 text-primary-600 bg-transparent hover:bg-primary-50',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100',
    danger: 'bg-red-500 text-white shadow-md shadow-red-200',
  }

  const sizes: Record<string, string> = {
    sm: 'text-sm px-4 py-2',
    md: 'text-base px-6 py-3',
    lg: 'text-lg px-8 py-4',
  }

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={disabled || isLoading} {...props}>
      {isLoading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        children
      )}
    </button>
  )
}
