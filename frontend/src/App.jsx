import { useState } from 'react'
import CadenceLibrary from './components/generator/CadenceLibrary'
import GeneratedEmails from './components/training/GeneratedEmails'
import DatabaseManager from './components/admin/DatabaseManager'

function App() {
  const [activeTab, setActiveTab] = useState('library')

  const tabs = [
    { id: 'library', label: 'Cadences' },
    { id: 'emails', label: 'Generated Emails' },
    { id: 'database', label: 'Database' }
  ]

  return (
    <div className="min-h-screen bg-gradient-ombre">
      <header className="backdrop-blur-md bg-bg-surface sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* IBM Logo - Larger and closer */}
              <img
                src="/ibm-blue-bee.png"
                alt="IBM"
                className="h-20 w-auto"
                style={{ filter: 'drop-shadow(0 0 10px rgba(69, 137, 255, 0.5))' }}
              />
              <div>
                <h1 className="text-3xl font-bold text-text-primary tracking-tight">
                  Sales Cadence Generator
                </h1>
                <p className="text-sm text-text-secondary mt-1.5">
                  AI-Powered Outreach Personalization for Infrastructure Sellers
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-text-secondary font-medium">Powered by Watsonx.ai</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation - No borders */}
        <div className="max-w-7xl mx-auto px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 font-medium text-sm transition-all duration-300 relative ${
                  activeTab === tab.id
                    ? 'text-ibm-blue-light'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-ibm-blue-glow to-ibm-blue-light shadow-glow"></div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        {activeTab === 'library' && <CadenceLibrary />}
        {activeTab === 'emails' && <GeneratedEmails />}
        {activeTab === 'database' && <DatabaseManager />}
      </main>

      <footer className="backdrop-blur-sm bg-bg-surface/30 mt-20">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <p className="text-center text-sm text-text-secondary">
            IBM Infrastructure Sales Team • Powered by Watsonx.ai
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

// Made with Bob
