import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Layout } from '@/components/layout'
import { TOAST_CONFIG } from '@/constants'

// Pages
import HomePage from '@/pages/HomePage'
import MatchingPage from '@/pages/MatchingPage'
import ResultsPage from '@/pages/ResultsPage'
import AboutPage from '@/pages/AboutPage'
import NotFoundPage from '@/pages/NotFoundPage'

// Global styles
import '@/index.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/matching" element={<MatchingPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
      
      {/* Toast Notifications */}
      <Toaster
        position={TOAST_CONFIG.position}
        toastOptions={{
          duration: TOAST_CONFIG.duration,
          style: TOAST_CONFIG.style,
        }}
      />
    </Router>
  )
}

export default App
