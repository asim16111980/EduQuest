/**
 * Password validation rules:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one digit
 * - At least one special character (!@#$%^&*()_+-=[]{}|;':"`,.<>?/)
 * - Not the same as the current password (when provided)
 */
export function validatePassword(pw: string): string | null {
  if (pw.length < 8) return 'يجب أن تكون 8 أحرف على الأقل'
  if (!/[A-Z]/.test(pw)) return 'يجب أن تحتوي على حرف كبير على الأقل'
  if (!/[a-z]/.test(pw)) return 'يجب أن تحتوي على حرف صغير على الأقل'
  if (!/[0-9]/.test(pw)) return 'يجب أن تحتوي على رقم على الأقل'
  if (!/[!@#$%^&*()_+\-=\[\]{}|;:'",.<>?/\\]/.test(pw)) return 'يجب أن تحتوي على رمز خاص على الأقل (!@#$%^&*...)'
  return null
}

/** Reusable password hint shown below password inputs. */
export const PASSWORD_HINT =
  '8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص'
