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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* IBM Logo */}
              <img
                src="/ibm-blue-bee.png"
                alt="IBM"
                className="h-10 w-auto"
              />
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Sales Cadence Generator
                </h1>
                <p className="text-sm text-gray-600 mt-0.5">
                  AI-Powered Outreach Personalization for Infrastructure Sellers
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Powered by Watsonx.ai</span>
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
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-ibm-blue text-ibm-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'library' && <CadenceLibrary />}
        {activeTab === 'emails' && <GeneratedEmails />}
        {activeTab === 'database' && <DatabaseManager />}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-sm text-gray-500">
            IBM Infrastructure Sales Team • Powered by Watsonx.ai
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

// Made with Bob
