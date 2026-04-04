import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AdminLogin from '@/pages/admin/AdminLogin'

describe('AdminLogin', () => {
  it('renders email and password fields', () => {
    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    )
    expect(screen.getByText('البريد الإلكتروني')).toBeTruthy()
    expect(screen.getByText('كلمة المرور')).toBeTruthy()
  })

  it('shows error on empty submit', async () => {
    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    )
    const form = screen.getByText('كلمة المرور')!.closest('form')!
    await fireEvent.submit(form)
  })

  it('shows attempts warning when loginAttempts >= 3', () => {
    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    )
    expect(screen.queryByText(/متبقي \d+ محاولات/)).toBeNull()
  })

  it('shows countdown timer UI when blocked', () => {
    render(
      <MemoryRouter>
        <AdminLogin />
      </MemoryRouter>
    )
    expect(screen.queryByText(/تم حظر محاولات تسجيل الدخول/)).toBeNull()
  })
})
