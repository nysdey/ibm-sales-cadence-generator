import { useState } from 'react'
import CadenceLibrary from './components/generator/CadenceLibrary'
import GeneratedEmails from './components/training/GeneratedEmails'
import DatabaseManager from './components/admin/DatabaseManager'
import UserManager from './components/admin/UserManager'

function App() {
  const [activeTab, setActiveTab] = useState('library')

  const tabs = [
    { id: 'library', label: 'Cadences' },
    { id: 'emails', label: 'Generated Emails' },
    { id: 'database', label: 'Database' },
    { id: 'users', label: 'Users' }
  ]

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header with thin white border at bottom - non-sticky with more padding */}
      <header className="bg-bg-base border-b border-border">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {/* IBM Logo - Slightly larger to fill space */}
              <img
                src="/ibm-blue-bee.png"
                alt="IBM"
                className="h-14 w-auto"
              />
              <div>
                <h1 className="text-3xl font-light text-text-primary tracking-tight">
                  IBM Seller Studio
                </h1>
                <p className="text-sm text-text-secondary mt-0.5 font-light">
                  AI-Powered Sales Intelligence & Outreach
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-text-tertiary font-light">Powered by Watsonx.ai</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation with thin white border */}
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8 border-t border-border pt-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                data-tab={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 font-normal text-sm transition-all duration-200 relative ${
                  activeTab === tab.id
                    ? 'text-text-primary'
                    : 'text-text-tertiary hover:text-text-primary'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ibm-blue"></div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'library' && <CadenceLibrary />}
        {activeTab === 'emails' && <GeneratedEmails />}
        {activeTab === 'database' && <DatabaseManager />}
        {activeTab === 'users' && <UserManager />}
      </main>

      <footer className="bg-bg-base border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-sm text-text-tertiary font-light">
            Built by Sydney Chin & Bob • IBM Infrastructure Sales Team • Powered by Watsonx.ai
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

// Made with Bob
