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
    <div className="min-h-screen bg-bg-base">
      <header className="bg-bg-surface/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              {/* IBM Logo - White bee for dark mode */}
              <img
                src="/ibm-blue-bee.png"
                alt="IBM"
                className="h-14 w-auto drop-shadow-lg"
              />
              <div className="border-l border-border-light pl-5">
                <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
                  Sales Cadence Generator
                </h1>
                <p className="text-sm text-text-secondary mt-1">
                  AI-Powered Outreach Personalization for Infrastructure Sellers
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="px-3 py-1.5 bg-bg-elevated rounded-lg border border-border">
                <span className="text-xs text-text-tertiary font-medium">Powered by Watsonx.ai</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-ibm-blue text-ibm-blue'
                    : 'border-transparent text-text-tertiary hover:text-text-primary hover:border-border-light'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === 'library' && <CadenceLibrary />}
        {activeTab === 'emails' && <GeneratedEmails />}
        {activeTab === 'database' && <DatabaseManager />}
      </main>

      <footer className="bg-bg-surface/50 border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-center text-sm text-text-muted">
            IBM Infrastructure Sales Team • Powered by Watsonx.ai
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

// Made with Bob
