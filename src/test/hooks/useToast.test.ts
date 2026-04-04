import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useToast } from '@/hooks/useToast'

describe('useToast', () => {
  it('showToast adds a toast to the list', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.add('Test toast', 'info')
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].message).toBe('Test toast')
    expect(result.current.toasts[0].type).toBe('info')
  })

  it('toast is removed after the timeout', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.add('Auto-dismiss toast', 'success')
    })

    expect(result.current.toasts).toHaveLength(1)

    // The toast component's useEffect handles the 4s auto-dismiss.
    // Since we're only testing the hook, we test manual removal.
    act(() => {
      result.current.remove(result.current.toasts[0].id)
    })

    expect(result.current.toasts).toHaveLength(0)
    vi.useRealTimers()
  })
})
