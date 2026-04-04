/**
 * UsersPage — full CRUD user management with search, filters, pagination, CSV export.
 * Route: /admin/users
 */
import { useState, useMemo } from 'react'
import { Users as UsersIcon, Download, Eye, Edit, Trash2, Plus } from 'lucide-react'
import { MOCK_USERS, type MockUser } from '@/data/mockAdminData'
import { getGradeById } from '@/data/grades'
import { grades } from '@/data/grades'
import { AdminBadge, AdminModal, AdminConfirmDialog } from '@/components/admin/shared'
import { logAction } from '@/lib/adminAuth'

const INITIAL_USERS = [...MOCK_USERS]

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function UsersPage() {
  const [users, setUsers] = useState<MockUser[]>(INITIAL_USERS)
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(0)
  const [loading] = useState(false)

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState<MockUser | null>(null)
  const [showViewModal, setShowViewModal] = useState<MockUser | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<MockUser | null>(null)

  // Form state
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formGrade, setFormGrade] = useState('')
  const [formStatus, setFormStatus] = useState<'active' | 'suspended'>('active')
  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (search && !u.name_ar.includes(search) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
      if (stageFilter) {
        const grade = getGradeById(u.grade_id)
        if (grade?.stage !== stageFilter) return false
      }
      if (statusFilter && u.status !== statusFilter) return false
      return true
    })
  }, [users, search, stageFilter, statusFilter])

  const PAGE_SIZE = 10
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const resetForm = () => {
    setFormName('')
    setFormEmail('')
    setFormGrade('')
    setFormStatus('active')
  }

  const handleAdd = () => {
    // SECURITY: Validate all inputs before use
    const trimmedName = formName.trim()
    const trimmedEmail = formEmail.trim()
    if (!trimmedName) return
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return
    if (!formGrade) return
    const newUser: MockUser = {
      id: `u${Date.now()}`,
      name_ar: trimmedName,
      email: trimmedEmail,
      grade_id: parseInt(formGrade),
      created_at: new Date().toISOString().slice(0, 10),
      status: formStatus,
    }
    setUsers((prev) => [...prev, newUser])
    logAction('EDIT_USER', trimmedEmail, 'added new user')
    setShowAddModal(false)
    resetForm()
  }

  const handleEdit = () => {
    if (!showEditModal) return
    // SECURITY: Validate inputs
    const trimmedName = formName.trim()
    const trimmedEmail = formEmail.trim()
    if (!trimmedName || !trimmedEmail) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return
    setUsers((prev) =>
      prev.map((u) =>
        u.id === showEditModal.id
          ? { ...u, name_ar: trimmedName, email: trimmedEmail, grade_id: parseInt(formGrade), status: formStatus }
          : u
      )
    )
    logAction('EDIT_USER', trimmedEmail, 'updated user info')
    setShowEditModal(null)
    resetForm()
  }

  const handleDelete = () => {
    if (!showDeleteConfirm) return
    setUsers((prev) => prev.filter((user) => user.id !== showDeleteConfirm.id))
    logAction('DELETE_USER', showDeleteConfirm.email, `deleted user ${showDeleteConfirm.name_ar}`)
    setShowDeleteConfirm(null)
  }

  const handleExport = () => {
    const headers = ['الاسم', 'البريد الإلكتروني', 'الصف', 'تاريخ التسجيل', 'الحالة']
    const rows = users.map((u) => {
      const grade = getGradeById(u.grade_id)
      return [u.name_ar, u.email, grade?.name_ar ?? '', u.created_at, u.status === 'active' ? 'نشط' : 'موقوف']
    })
    const csv = '\uFEFF' + [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const openAddModal = () => { resetForm(); setShowAddModal(true) }
  const openEditModal = (user: MockUser) => {
    setFormName(user.name_ar)
    setFormEmail(user.email)
    setFormGrade(String(user.grade_id))
    setFormStatus(user.status)
    setShowEditModal(user)
  }

  return (
    <div className="space-y-5" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UsersIcon className="w-5 h-5 text-purple-500" />
          <h2 className="font-display font-bold text-gray-800">المستخدمون</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 font-body text-sm hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" /> تصدير
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-body text-sm font-bold hover:shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" /> إضافة مستخدم
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="بحث بالاسم أو البريد…"
          aria-label="بحث بالاسم أو البريد"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
        />
        <select
          value={stageFilter}
          onChange={(e) => { setStageFilter(e.target.value); setPage(0) }}
          aria-label="تصفية حسب المرحلة"
          className="px-3 py-2.5 rounded-xl border border-gray-200 font-body text-sm bg-white"
        >
          <option value=""> كل المراحل</option>
          <option value="primary">الابتدائي</option>
          <option value="preparatory">الإعدادي</option>
          <option value="secondary">الثانوي</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }}
          aria-label="تصفية حسب الحالة"
          className="px-3 py-2.5 rounded-xl border border-gray-200 font-body text-sm bg-white"
        >
          <option value=""> كل الحالات</option>
          <option value="active">نشط</option>
          <option value="suspended">موقوف</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : pageData.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl block mb-2">📭</span>
          <p className="font-body text-gray-500">لا توجد نتائج</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
            <table className="w-full text-sm" dir="rtl">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-right font-body font-bold text-gray-500">#</th>
                  <th className="px-4 py-3 text-right font-body font-bold text-gray-500">الاسم</th>
                  <th className="px-4 py-3 text-right font-body font-bold text-gray-500">البريد</th>
                  <th className="px-4 py-3 text-right font-body font-bold text-gray-500">الصف</th>
                  <th className="px-4 py-3 text-right font-body font-bold text-gray-500">التاريخ</th>
                  <th className="px-4 py-3 text-right font-body font-bold text-gray-500">الحالة</th>
                  <th className="px-4 py-3 text-right font-body font-bold text-gray-500">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {pageData.map((user, i) => {
                  const grade = getGradeById(user.grade_id)
                  return (
                    <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-body text-gray-600">{page * PAGE_SIZE + i + 1}</td>
                      <td className="px-4 py-3 font-body font-bold text-gray-700">{user.name_ar}</td>
                      <td className="px-4 py-3 font-body text-gray-500" dir="ltr">{user.email}</td>
                      <td className="px-4 py-3"><AdminBadge text={grade?.name_ar ?? ''} variant="stage" /></td>
                      <td className="px-4 py-3 font-body text-gray-400 text-xs">{formatDate(user.created_at)}</td>
                      <td className="px-4 py-3">
                        <AdminBadge text={user.status === 'active' ? 'نشط' : 'موقوف'} variant="status" />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1" dir="ltr">
                          <button
                            onClick={() => setShowViewModal(user)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500" title="عرض"
                          ><Eye className="w-4 h-4" /></button>
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500" title="تعديل"
                          ><Edit className="w-4 h-4" /></button>
                          <button
                            onClick={() => setShowDeleteConfirm(user)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500" title="حذف"
                          ><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between font-body text-sm text-gray-500">
              <span>{filtered.length} نتيجة</span>
              <div className="flex gap-1" dir="ltr">
                <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">السابق</button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button key={i} onClick={() => setPage(i)} className={`px-3 py-1.5 rounded-lg ${page === i ? 'bg-purple-500 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>{i + 1}</button>
                ))}
                <button onClick={() => setPage(Math.min(totalPages - 1, page + 1))} disabled={page >= totalPages - 1} className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">التالي</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <AdminModal title="إضافة مستخدم جديد" onConfirm={handleAdd} onCancel={() => setShowAddModal(false)} confirmLabel="إضافة">
          <input type="text" placeholder="الاسم الكامل" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full mb-3 px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm" />
          <input type="email" placeholder="البريد الإلكتروني" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full mb-3 px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm" />
          <select value={formGrade} onChange={(e) => setFormGrade(e.target.value)} className="w-full mb-3 px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm">
            <option value="">اختر الصف</option>
            {grades.map((g) => <option key={g.id} value={g.id}>{g.name_ar}</option>)}
          </select>
          <div className="flex items-center justify-between mt-2">
            <span className="font-body text-sm text-gray-600">الحالة:</span>
            <div className="flex gap-3">
              <button onClick={() => setFormStatus('active')} className={`px-3 py-1 rounded-lg text-sm font-body ${formStatus === 'active' ? 'bg-emerald-100 text-emerald-700 font-bold' : 'text-gray-400'}`}>نشط</button>
              <button onClick={() => setFormStatus('suspended')} className={`px-3 py-1 rounded-lg text-sm font-body ${formStatus === 'suspended' ? 'bg-red-100 text-red-700 font-bold' : 'text-gray-400'}`}>موقوف</button>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <AdminModal title="تعديل المستخدم" onConfirm={handleEdit} onCancel={() => setShowEditModal(null)} confirmLabel="حفظ">
          <input type="text" placeholder="الاسم" value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full mb-3 px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm" />
          <input type="email" placeholder="البريد" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full mb-3 px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm" />
        </AdminModal>
      )}

      {/* View Modal */}
      {showViewModal && (
        <AdminModal title="عرض الملف الشخصي" onCancel={() => setShowViewModal(null)}>
          <div className="space-y-3">
            <div><span className="font-body text-xs text-gray-400">الاسم:</span> <span className="font-body text-sm">{showViewModal.name_ar}</span></div>
            <div><span className="font-body text-xs text-gray-400">البريد:</span> <span className="font-body text-sm" dir="ltr">{showViewModal.email}</span></div>
            <div><span className="font-body text-xs text-gray-400">الصف:</span> <span className="font-body text-sm">{getGradeById(showViewModal.grade_id)?.name_ar}</span></div>
            <div><span className="font-body text-xs text-gray-400">الحالة:</span> <AdminBadge text={showViewModal.status === 'active' ? 'نشط' : 'موقوف'} variant="status" /></div>
            <div><span className="font-body text-xs text-gray-400">تاريخ التسجيل:</span> <span className="font-body text-sm">{formatDate(showViewModal.created_at)}</span></div>
            <hr />
            <p className="font-body text-xs text-gray-400 mb-2">آخر 5 ألعاب:</p>
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex justify-between text-sm font-body">
                <span className="text-gray-600">لعبة #{n}</span><span className="text-emerald-600">⭐ {n * 2}/3</span>
              </div>
            ))}
          </div>
        </AdminModal>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <AdminConfirmDialog
          title="حذف المستخدم"
          message={`هل أنت متأكد من حذف "${showDeleteConfirm.name_ar}"؟ لا يمكن التراجع.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  )
}
