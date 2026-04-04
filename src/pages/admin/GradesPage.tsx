/**
 * GradesPage — grade management grouped by stage.
 * Route: /admin/grades
 */
import { useState } from 'react'
import { GraduationCap, ChevronDown, ChevronUp, Edit, Save, X, Gamepad2 } from 'lucide-react'
import { grades, stages } from '@/data/grades'
import { STAGE_COLORS, type Stage } from '@/types'
import { getGamesByGrade } from '@/data/games'
import { AdminBadge, AdminConfirmDialog, AdminModal, AdminSwitch } from '@/components/admin/shared'
import { MOCK_USERS } from '@/data/mockAdminData'
import { logAction } from '@/lib/adminAuth'

interface GradeState {
  id: number
  name_ar: string
  name_en: string
  stage: string
  order: number
  active: boolean
}

export default function GradesPage() {
  const [gradeStates, setGradeStates] = useState<GradeState[]>(
    grades.map((g) => ({ ...g, active: true }))
  )
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [expandedStage, setExpandedStage] = useState<string | null>('primary')
  const [manageGrade, setManageGrade] = useState<GradeState | null>(null)
  const [confirmToggleGrade, setConfirmToggleGrade] = useState<GradeState | null>(null)

  const handleEdit = (grade: GradeState) => {
    setEditingId(grade.id)
    setEditName(grade.name_ar)
  }

  const handleSave = (grade: GradeState) => {
    setGradeStates((prev) => prev.map((g) => g.id === grade.id ? { ...g, name_ar: editName } : g))
    logAction('EDIT_GRADE', grade.name_ar, `renamed to ${editName}`)
    setEditingId(null)
  }

  const handleToggleActive = (grade: GradeState) => {
    if (!grade.active) {
      setConfirmToggleGrade(grade)
    } else {
      setGradeStates((prev) => prev.map((g) => g.id === grade.id ? { ...g, active: false } : g))
      logAction('EDIT_GRADE', grade.name_ar, 'deactivated')
    }
  }

  const confirmToggle = () => {
    if (confirmToggleGrade) {
      setGradeStates((prev) => prev.map((g) => g.id === confirmToggleGrade.id ? { ...g, active: true } : g))
      logAction('EDIT_GRADE', confirmToggleGrade.name_ar, 'activated')
      setConfirmToggleGrade(null)
    }
  }

  const stageGrouped = stages.map((stage) => ({
    stage,
    grades: gradeStates.filter((g) => g.stage === stage.key),
  }))

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-purple-500" />
        <h2 className="font-display font-bold text-gray-800">الصفوف الدراسية</h2>
      </div>

      {stageGrouped.map(({ stage, grades: stageGrades }) => {
        const colors = STAGE_COLORS[stage.key as Stage]
        const isOpen = expandedStage === stage.key

        return (
          <div key={stage.key} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Stage header */}
            <button
              onClick={() => setExpandedStage(isOpen ? null : stage.key)}
              className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: colors.light }}>
                  {stage.emoji}
                </div>
                <div>
                  <h3 className="font-body font-bold text-gray-800">{stage.name_ar}</h3>
                  <p className="text-xs text-gray-400 font-body">{stage.name_en}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <AdminBadge text={`${stageGrades.length} صفوف`} variant="subject" />
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
              </div>
            </button>

            {/* Grades table */}
            {isOpen && (
              <div className="animate-slide-up">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right font-body font-bold text-gray-500">الصف</th>
                        <th className="px-4 py-3 text-right font-body font-bold text-gray-500">عدد الألعاب</th>
                        <th className="px-4 py-3 text-right font-body font-bold text-gray-500">عدد الطلاب</th>
                        <th className="px-4 py-3 text-right font-body font-bold text-gray-500">الحالة</th>
                        <th className="px-4 py-3 text-right font-body font-bold text-gray-500">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stageGrades.map((grade) => {
                        const gameCount = getGamesByGrade(grade.id).length
                        const studentCount = MOCK_USERS.filter((u) => u.grade_id === grade.id).length

                        return (
                          <tr key={grade.id} className="border-t border-gray-100">
                            <td className="px-4 py-3 font-body font-bold text-gray-700">
                              {editingId === grade.id ? (
                                <input
                                  type="text"
                                  value={editName}
                                  onChange={(e) => setEditName(e.target.value)}
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleSave(grade) }}
                                  className="px-2 py-1 rounded border border-purple-300 w-40 font-body text-sm"
                                  autoFocus
                                />
                              ) : (
                                grade.name_ar
                              )}
                            </td>
                            <td className="px-4 py-3 font-body text-gray-600">{gameCount}</td>
                            <td className="px-4 py-3 font-body text-gray-600">{studentCount}</td>
                            <td className="px-4 py-3">
                              <AdminBadge text={grade.active ? 'نشط' : 'معطل'} variant={grade.active ? 'status' : 'status'} />
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2" dir="ltr">
                                {editingId === grade.id ? (
                                  <>
                                    <button onClick={() => handleSave(grade)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500">
                                      <Save className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400">
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <button onClick={() => handleEdit(grade)} className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500">
                                    <Edit className="w-4 h-4" />
                                  </button>
                                )}
                                <AdminSwitch checked={grade.active} onChange={() => handleToggleActive(grade)} />
                                <button
                                  onClick={() => setManageGrade(grade)}
                                  className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-500"
                                  title="إدارة الألعاب"
                                >
                                  <Gamepad2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Manage Grade Games Modal */}
      {manageGrade && (
        <AdminModal
          title={`إدارة ألعاب ${manageGrade.name_ar}`}
          onCancel={() => setManageGrade(null)}
          size="lg"
        >
          <div className="space-y-2">
            {getGamesByGrade(manageGrade.id).map((game, i) => (
              <div key={game.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-body text-xs">{i + 1}</span>
                  <span className="font-body text-sm font-bold text-gray-700">{game.title}</span>
                  <AdminBadge text={game.subject} variant="subject" />
                </div>
                <div className="flex items-center gap-2" dir="ltr">
                  <button className="p-1 rounded hover:bg-gray-100 text-gray-400">↑</button>
                  <button className="p-1 rounded hover:bg-gray-100 text-gray-400">↓</button>
                  <AdminSwitch checked={true} onChange={() => {}} />
                </div>
              </div>
            ))}
            {getGamesByGrade(manageGrade.id).length === 0 && (
              <p className="text-center text-gray-400 font-body text-sm py-6">لا توجد ألعاب لهذا الصف</p>
            )}
          </div>
        </AdminModal>
      )}

      {/* Confirm Toggle */}
      {confirmToggleGrade && (
        <AdminConfirmDialog
          title={`تنشيط ${confirmToggleGrade.name_ar}`}
          message="هل أنت متأكد من تنشيط هذا الصف؟"
          onConfirm={confirmToggle}
          onCancel={() => setConfirmToggleGrade(null)}
          danger={false}
        />
      )}
    </div>
  )
}
