import { Link } from 'react-router-dom'
import { Heart, BookOpen } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-500 flex items-center justify-center text-white font-display font-bold text-lg">E</div>
              <span className="font-display font-bold text-xl text-white">EduQuest</span>
            </Link>
            <p className="font-body text-sm leading-relaxed">
              Making learning fun and accessible for every Egyptian student. Interactive games aligned with the Ministry of Education curriculum.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold text-white mb-3">Stages</h4>
            <ul className="space-y-2 font-body text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">🌟 Primary (الابتدائي)</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">📚 Preparatory (الإعدادي)</Link></li>
              <li><Link to="/" className="hover:text-white transition-colors">🎓 Secondary (الثانوي)</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-white mb-3">Links</h4>
            <ul className="space-y-2 font-body text-sm">
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-1 text-sm font-body">
            Made with <Heart className="w-4 h-4 text-red-400" /> for Egyptian students
          </p>
          <p className="text-sm font-body flex items-center gap-1">
            <BookOpen className="w-4 h-4" /> © 2026 EduQuest
          </p>
        </div>
      </div>
    </footer>
  )
}
