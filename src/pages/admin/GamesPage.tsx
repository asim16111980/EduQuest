/**
 * GamesPage — games grid management + questions sub-tab.
 * Route: /admin/games
 */
import { useState, useMemo } from 'react'
import { Gamepad2, Plus, Edit, Trash2, Eye, List, Search } from 'lucide-react'
import { games, getGamesByGrade, getGameById } from '@/data/games'
import { grades, stages, getGradeById } from '@/data/grades'
import { STAGE_COLORS, type Stage } from '@/types'
import { AdminModal, AdminConfirmDialog, AdminBadge } from '@/components/admin/shared'
import { generateMockQuestions, getMockPlayCount } from '@/data/mockAdminData'
import { logAction, type AuditAction } from '@/lib/adminAuth'

export default function GamesPage() {
  const [tab, setTab] = useState<'games' | 'questions'>('games')
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')
  const [stageFilter, setStageFilter] = useState('')

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState<any>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<any>(null)

  // Form
  const [formTitle, setFormTitle] = useState('')
  const [formTitleAr, setFormTitleAr] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formDescAr, setFormDescAr] = useState('')
  const [formSubject, setFormSubject] = useState('math')
  const [formGrade, setFormGrade] = useState('1')
  const [formDifficulty, setFormDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')

  // Questions
  const [selectedGame, setSelectedGame] = useState<any>(null)

  const subjects = ['math', 'arabic', 'science', 'english', 'geography', 'history'] as const
  const difficulties = [
    { value: 'easy', label: 'سهل' },
    { value: 'medium', label: 'متوسط' },
    { value: 'hard', label: 'صعب' },
  ]

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      if (search && !g.title.includes(search) && !(g as any).title_ar?.includes(search)) return false
      if (subjectFilter && g.subject !== subjectFilter) return false
      if (difficultyFilter && g.difficulty !== difficultyFilter) return false
      if (stageFilter) {
        const grade = getGradeById(g.grade_id)
        if (grade?.stage !== stageFilter) return false
      }
      return true
    })
  }, [search, subjectFilter, difficultyFilter, stageFilter])

  // Questions for selected game
  const gameQuestions = useMemo(() => {
    if (!selectedGame) return []
    return generateMockQuestions(selectedGame.subject)
  }, [selectedGame])

  // Subject emojis
  const subjectEmojis: Record<string, string> = {
    math: '🔢', arabic: '📝', science: '🔬', english: '🔤', geography: '🌍', history: '🏛️',
  }

  const resetForm = () => {
    setFormTitle('')
    setFormTitleAr('')
    setFormDesc('')
    setFormDescAr('')
    setFormSubject('math')
    setFormGrade('1')
    setFormDifficulty('medium')
  }

  const handleSaveGame = () => {
    if (!formTitle || !formGrade) return
    // Simulated: in reality this goes to DB
    logAction(showEditModal ? 'EDIT_GAME' : 'ADD_GAME', formTitle, showEditModal ? 'edited' : 'added')
    setShowCreateModal(false)
    setShowEditModal(null)
    resetForm()
  }

  const handleDeleteGame = () => {
    if (showDeleteConfirm) {
      logAction('DELETE_GAME', showDeleteConfirm.title, 'deleted game')
      setShowDeleteConfirm(null)
    }
  }

  const openEdit = (game: any) => {
    setFormTitle(game.title)
    setFormTitleAr((game as any).title_ar ?? '')
    setFormDesc(game.description)
    setFormDescAr((game as any).description_ar ?? '')
    setFormSubject(game.subject)
    setFormGrade(String(game.grade_id))
    setFormDifficulty(game.difficulty)
    setShowEditModal(game)
  }

  return (
    <div className="space-y-5" dir="rtl">
      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setTab('games')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
            tab === 'games' ? 'bg-purple-100 text-purple-700' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Gamepad2 className="w-4 h-4" /> الألعاب
        </button>
        <button
          onClick={() => setTab('questions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
            tab === 'questions' ? 'bg-purple-100 text-purple-700' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <List className="w-4 h-4" /> الأسئلة
        </button>
      </div>

      {tab === 'games' ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="بحث عن لعبة…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-gray-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
              />
            </div>
            <select value={!subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 font-body text-sm bg-white">
              <option value=""> كل المواد</option>
              {subjects.map((s) => <option key={s} value={s}>{subjectEmojis[s]} {s}</option>)}
            </select>
            <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 font-body text-sm bg-white">
              <option value=""> كل المستويات</option>
              {difficulties.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
            <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 font-body text-sm bg-white">
              <option value=""> كل المراحل</option>
              {stages.map((s) => <option key={s.key} value={s.key}>{s.name_ar}</option>)}
            </select>
            <button
              onClick={() => { resetForm(); setShowCreateModal(true) }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-body text-sm font-bold hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" /> إضافة لعبة
            </button>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGames.map((game) => {
              const grade = getGradeById(game.grade_id)
              const stageColors = STAGE_COLORS[grade?.stage as Stage] || STAGE_COLORS.primary
              const playCount = getMockPlayCount(game.id)

              return (
                <div key={game.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-24 flex items-center justify-center relative" style={{ backgroundColor: stageColors.bg }}>
                    <span className="text-4xl">{subjectEmojis[game.subject] || '📖'}</span>
                    <span className="absolute top-2 left-2">
                      <AdminBadge text={game.difficulty} variant="difficulty" />
                    </span>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-800 text-sm">{game.title}</h4>
                    {(game as any).title_ar && <p className="font-body text-xs text-gray-400 mt-0.5">{(game as any).title_ar}</p>}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <AdminBadge text={grade?.name_ar ?? ''} variant="stage" />
                        <span className="text-xs text-gray-400 font-body">{game.subject}</span>
                      </div>
                      <span className="text-xs text-gray-400 font-body">🎮 {playCount}</span>
                    </div>
                    <div className="flex gap-1 mt-3 pt-3 border-t border-gray-100" dir="ltr">
                      <button onClick={() => { logAction('EDIT_GAME', game.title); /* view */ }} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs hover:bg-blue-50 text-blue-500"><Eye className="w-3.! h-3" /> عرض</button>
                      <button onClick={() => openEdit(game)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs hover:bg-amber-50 text-amber-500"><Edit className="w-3 h-3" /> تعديل</button>
                      <button onClick={() => setShowDeleteConfirm(game)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs hover:bg-red-50 text-red-500"><Trash2 className="w-3 h-3" /> حذف</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-12">
              <span className="text-4xl block mb-2">🎮</span>
              <p className="font-body text-gray-500">لم يتم العثور على ألعاب مطابقة</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Questions Tab */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <select
                value={selectedGame?.id ?? ''}
                onChange={(e) => {
                  const g = games.find((gm) => gm.id === e.target.value)
                  setSelectedGame(g ?? null)
                }}
                className="w-max px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-200"
              >
                <option value="">اختر لعبة لعرض أسئلتها</option>
                {games.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}
              </select>
              {selectedGame && (
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-100 text-purple-700 font-body text-sm font-bold">
                  <Plus className="w-4 h-4" /> إضافة سؤال
                </button>
              )}
            </div>

            {!selectedGame ? (
              <div className="text-center py-12 text-gray-400 font-body">اختر لعبة من القائمة لعرض أسئلتها</div>
            ) : (
              <div className="space-y-3">
                {gameQuestions.map((q, i) => (
                  <div key={q.id} className="rounded-xl border border-gray-200 p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-bold font-body text-sm text-gray-800 mb-2">
                          <span className="text-purple-500">#{i + 1}</span> &nbsp; {q.question_ar}
                        </p>
                        <div className="flex flex-wrap gap-2" dir="rtl">
                          {q.options.map((opt, oi) => (
                            <span
                              key={oi}
                              className={`px-3 py-1.5 rounded-lg text-xs font-body ${
                                oi === q.correct
                                  ? 'bg-emerald-100 text-emerald-700 font-bold border border-emerald-300'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {opt} {oi === q.correct && ' ✓'}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-500"><Edit className="w-3.5 h-3.5" /></button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <div className="mt-2"><AdminBadge text={q.difficulty} variant="difficulty" /></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Create/Edit Game Modal */}
      {(showCreateModal || showEditModal) && (
        <AdminModal
          title={showEditModal ? 'تعديل اللعبة' : 'إضافة لعبة جديدة'}
          onConfirm={handleSaveGame}
          onCancel={() => { setShowCreateModal(false); setShowEditModal(null); }}
          confirmLabel={showEditModal ? 'حفظ' : 'إضافة'}
          size="lg"
        >
          <input type="text" placeholder="اسم اللعبة (English)" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full mb-3 px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm" dir="ltr" />
          <input type="text" placeholder="اسم اللعبة (عربي)" value={formTitleAr} onChange={(e) => setFormTitleAr(e.target.value)} className="w-full mb-3 px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm" dir="rtl" />
          <textarea placeholder="الوصف (English)" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={2} className="w-full mb-3 px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm resize-none" dir="ltr" />
          <textarea placeholder="الوصف (عربي)" value={formDescAr} onChange={(e) => setFormDescAr(e.target.value)} rows={2} className="w-full mb-3 px-4 py-2.5 rounded-xl border border-gray-200 font-body text-sm resize-none" dir="rtl" />
          <div className="grid grid-cols-3 gap-3">
            <select value={formSubject} onChange={(e) => setFormSubject(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 font-body text-sm">
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={formGrade} onChange={(e) => setFormGrade(e.target.value)} className="px-3 py-2.5 rounded-xl border border-gray-200 font-body text-sm">
              {grades.map((g) => <option key={g.id} value={g.id}>{g.name_ar}</option>)}
            </select>
            <select value={formDifficulty} onChange={(e) => setFormDifficulty(e.target.value as any)} className="px-3 py-2.5 rounded-xl border border-gray-200 font-body text-sm">
              {difficulties.map((d) => <option key={d.value} value={d.value}>{d.value}</option>)}
            </select>
          </div>
        </AdminModal>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <AdminConfirmDialog
          title="حذف اللعبة"
          message={`هل أنت متأكد من حذف "${showDeleteConfirm.title}"؟ لا يمكن التراجع.`}
          onConfirm={handleDeleteGame}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  )
}
