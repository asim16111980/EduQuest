import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { BrowserRouter } from 'react-router-dom'
import './index.css'

function RouterHandler({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const target = sessionStorage.getItem('gh-redirect')
    if (target) {
      sessionStorage.removeItem('gh-redirect')
      if (target !== window.location.pathname.slice(1)) {
        window.location.pathname = '/' + target
      }
    }
  }, [])
  return (
    <BrowserRouter basename={import.meta.env.PROD ? '/EduQuest' : ''}>
      {children}
    </BrowserRouter>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterHandler>
      <App />
    </RouterHandler>
  </React.StrictMode>,
)
