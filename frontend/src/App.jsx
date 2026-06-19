import { useState } from 'react'
import CadenceGenerator from './components/generator/CadenceGenerator'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-ibm-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">IBM</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Fusion Cadence Generator
                </h1>
                <p className="text-sm text-gray-600">
                  AI-Powered Personalized Sales Outreach
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Phase 1 MVP</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CadenceGenerator />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            IBM Fusion Sales Team • Powered by Azure OpenAI
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

// Made with Bob
