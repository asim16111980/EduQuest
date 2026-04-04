/**
 * AuditPage — audit log viewer with filtering, auto-refresh, and clear functionality.
 * Route: /admin/audit
 */
import { useState, useEffect } from 'react'
import { ShieldCheck, Trash2, RefreshCw } from 'lucide-react'
import { getAuditLog, clearAuditLog, type AuditEntry } from '@/lib/adminAuth'
import { AdminBadge, AdminConfirmDialog } from '@/components/admin/shared'

const actionLabels: Record<string, string> = {
  LOGIN: 'تسجيل دخول',
  LOGOUT: 'تسجيل خروج',
  DELETE_USER: 'حذف مستخدم',
  EDIT_USER: 'تعديل مستخدم',
  ADD_GAME: 'إضافة لعبة',
  DELETE_GAME: 'حذف لعبة',
  EDIT_GAME: 'تعديل لعبة',
  EDIT_GRADE: 'تعديل صف',
  EDIT_CONTENT: 'تعديل محتوى',
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString('ar-EG', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([])
  const [filterAction, setFilterAction] = useState('')
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(getAuditLog())
    }, 30_000)
    return () => clearInterval(interval)
  }, [])

  // Initial load
  useEffect(() => {
    setLogs(getAuditLog())
  }, [])

  const filteredLogs = filterAction ? logs.filter((l) => l.action === filterAction) : logs

  const actionOptions = Object.keys(actionLabels)

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-500" />
          <h2 className="font-display font-bold text-gray-800">سجل العمليات</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLogs(getAuditLog())}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-sm font-body hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" /> تحديث
          </button>
          {logs.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-500 text-sm font-body hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" /> مسح السجل
            </button>
          )}
        </div>
      </div>

      {/* Filter */}
      {logs.length > 0 && (
        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm bg-white"
        >
          <option value=""> كل العمليات</option>
          {actionOptions.map((a) => (
            <option key={a} value={a}>{actionLabels[a]}</option>
          ))}
        </select>
      )}

      {/* Log table */}
      {filteredLogs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <span className="text-5xl block mb-3">🔍</span>
          <p className="font-body text-gray-500 text-lg">لا توجد عمليات مسجلة بعد</p>
          <p className="font-body text-gray-400 text-sm mt-1">ستظهر هنا سجل العمليات الإدارية بمجرد البدء</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right font-body font-bold text-gray-500">الوقت</th>
                  <th className="px-4 py-3 text-right font-body font-bold text-gray-500">العملية</th>
                  <th className="px-4 py-3 text-right font-body font-bold text-gray-500">الهدف</th>
                  <th className="px-4 py-3 text-right font-body font-bold text-gray-500">التفاصيل</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((entry) => (
                  <tr key={entry.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-body text-xs text-gray-400 whitespace-nowrap" dir="ltr">
                      {formatTime(entry.timestamp)}
                    </td>
                    <td className="px-4 py-3">
                      <AdminBadge text={actionLabels[entry.action] ?? entry.action} variant="action" />
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-gray-600">
                      {entry.target ? (
                        <span dir="rtl">{entry.target}</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-gray-400">
                      {entry.details || <span className="text-gray-300">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Clear Confirm */}
      {showClearConfirm && (
        <AdminConfirmDialog
          title="مسح سجل العمليات"
          message="هل أنت متأكد؟ سيتم حذف جميع السجلات نهائياً."
          onConfirm={() => {
            clearAuditLog()
            setLogs([])
            setShowClearConfirm(false)
          }}
          onCancel={() => setShowClearConfirm(false)}
        />
      )}
    </div>
  )
}
