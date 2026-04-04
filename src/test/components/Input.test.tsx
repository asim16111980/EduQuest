import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/Input'

describe('Input', () => {
  it('renders label and input', () => {
    render(<Input label="Email" placeholder="test@example.com" />)
    expect(screen.getByText('Email')).toBeTruthy()
    expect(screen.getByPlaceholderText('test@example.com')).toBeTruthy()
  })

  it('shows error message when error prop is provided', () => {
    render(<Input label="Email" error="Email is required" />)
    expect(screen.getByText('Email is required')).toBeTruthy()
    // Input should have error styling
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-red-300')
  })

  it('calls onChange handler on user input', async () => {
    const onChange = vi.fn()
    render(<Input label="Name" onChange={onChange} />)
    const input = screen.getByRole('textbox')
    await fireEvent.change(input, { target: { value: 'Hello' } })
    expect(onChange).toHaveBeenCalledOnce()
  })
})
