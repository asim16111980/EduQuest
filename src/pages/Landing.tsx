import { Link } from 'react-router-dom'
import { BookOpen, Trophy, Star, Rocket, ArrowRight, GraduationCap } from 'lucide-react'
import { stages } from '@/data/grades'
import { STAGE_COLORS, type Stage } from '@/types'

const features = [
  { icon: BookOpen, title: 'Aligned Curriculum', desc: 'All games match the Egyptian Ministry of Education standards', color: 'from-blue-500 to-blue-600' },
  { icon: Trophy, title: 'Track Progress', desc: 'Stars, scores, and achievement tracking for every student', color: 'from-amber-500 to-orange-500' },
  { icon: Star, title: 'Make Learning Fun', desc: 'Interactive games that turn study time into play time', color: 'from-emerald-500 to-teal-500' },
  { icon: Rocket, title: '12 School Grades', desc: 'From first grade to third secondary, we have you covered', color: 'from-purple-500 to-indigo-500' },
]

const stats = [
  { value: '36+', label: 'Educational Games' },
  { value: '12', label: 'School Grades' },
  { value: '6', label: 'Subjects Covered' },
  { value: '3', label: 'School Stages' },
]

export function Landing() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative pt-20 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-full px-4 py-1.5 text-primary-600 font-body font-semibold text-sm mb-6 animate-fade-in">
            <GraduationCap className="w-4 h-4" />
            Egyptian Curriculum Games
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 leading-tight mb-6 animate-slide-up">
            Learn Through{' '}
            <span className="bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Play
            </span>
          </h1>

          <p className="font-body text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Interactive educational games for Egyptian students from grade 1 to grade 12.
            Study smarter, learn faster, have fun!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/register">
              <span className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-display font-bold px-8 py-4 rounded-2xl shadow-lg shadow-primary-200 hover:shadow-xl hover:-translate-y-0.5 transition-all text-lg cursor-pointer"
              >
                Start Learning <Rocket className="w-5 h-5" />
              </span>
            </Link>
            <Link to="/login">
              <span className="inline-flex items-center gap-2 bg-white text-gray-700 font-display font-bold px-8 py-4 rounded-2xl shadow-md border border-gray-200 hover:border-primary-200 hover:shadow-lg hover:-translate-y-0.5 transition-all text-lg cursor-pointer">
                Login <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-3xl font-bold text-primary-600">{s.value}</div>
                <div className="font-body text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stages */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl font-bold text-center text-gray-800 mb-4">Choose Your Stage</h2>
          <p className="text-center text-gray-500 font-body mb-12">Select your school stage to explore games</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stages.map((stage) => {
              const c = STAGE_COLORS[stage.key as Stage]
              return (
                <div
                  key={stage.key}
                  className="group rounded-3xl p-8 border-2 border-gray-100 hover:border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden cursor-pointer"
                  style={{ background: `linear-gradient(135deg, ${c.primary}08, ${c.accent}08)` }}
                >
                  <div className="text-5xl mb-4">{stage.emoji}</div>
                  <h3 className="font-display text-2xl font-bold mb-1" style={{ color: c.primary }}>{stage.name_en}</h3>
                  <p className="font-arabic text-lg mb-4 opacity-60" dir="rtl">{stage.name_ar}</p>
                  <p className="font-body text-sm text-gray-500">Grades {stage.key === 'primary' ? '1-6' : stage.key === 'preparatory' ? '7-9' : '10-12'}</p>
                  <Link to="/register">
                    <span className="inline-flex items-center gap-1 mt-4 font-bold text-sm group-hover:gap-2 transition-all" style={{ color: c.primary }}>
                      Start Now <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-4xl font-bold text-center text-gray-800 mb-12">Why EduQuest?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-50">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-4`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-gray-800 mb-2">{f.title}</h3>
                <p className="font-body text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary-500 to-purple-600 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="shape w-40 h-40 bg-white" style={{ top: '10%', left: '10%', animationDelay: '0s' }} />
            <div className="shape w-32 h-24 bg-white" style={{ bottom: '10%', right: '10%', animationDelay: '2s' }} />
            <div className="shape w-20 h-20 bg-white" style={{ top: '20%', right: '25%', animationDelay: '4s' }} />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 relative z-10">Ready to Start Learning?</h2>
          <p className="font-body text-lg opacity-90 mb-8 relative z-10">Create your free account and start playing educational games today</p>
          <Link to="/register">
            <span className="inline-flex items-center gap-2 bg-white text-primary-600 font-display font-bold px-8 py-4 rounded-2xl shadow-lg hover:-translate-y-0.5 transition-all text-lg relative z-10 cursor-pointer">
              Join EduQuest <Rocket className="w-5 h-5" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  )
}
