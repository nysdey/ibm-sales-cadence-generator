import { useState } from 'react'
import { User, ChevronDown } from 'lucide-react'
import CadenceLibrary from './components/generator/CadenceLibrary'
import GeneratedEmails from './components/training/GeneratedEmails'
import DatabaseManager from './components/admin/DatabaseManager'
import UserManager from './components/admin/UserManager'
import UserProfile from './components/admin/UserProfile'
import { useUser } from './contexts/UserContext'

function App() {
  const [activeTab, setActiveTab] = useState('library')
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const { currentUser, users, switchUser } = useUser()

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
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* IBM Logo - Increased size */}
              <img
                src="/ibm-blue-bee.png"
                alt="IBM"
                className="h-16 w-auto"
              />
              <div>
                <h1 className="text-4xl font-light text-text-primary tracking-tight leading-none">
                  IBM Seller Studio
                </h1>
                <p className="text-base text-text-secondary mt-0.5 font-light">
                  AI-Powered Sales Intelligence & Outreach
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-tertiary font-light">Powered by Watsonx.ai</span>
              <div className="h-6 w-px bg-border"></div>
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-2 text-sm text-text-primary hover:text-ibm-blue transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="font-light">{currentUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-bg-surface border border-border shadow-lg z-50">
                    <div className="p-4 border-b border-border">
                      <div className="text-sm font-medium text-text-primary">{currentUser.name}</div>
                      <div className="text-xs text-text-tertiary mt-1">{currentUser.email}</div>
                      <div className="text-xs text-text-tertiary">{currentUser.role}</div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setActiveTab('profile')
                          setShowProfileDropdown(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-bg-raised transition-colors"
                      >
                        View Profile
                      </button>
                      <div className="border-t border-border my-2"></div>
                      <div className="px-3 py-1 text-xs text-text-tertiary font-medium">Switch User</div>
                      {users.filter(u => u.id !== currentUser.id).map(user => (
                        <button
                          key={user.id}
                          onClick={() => {
                            switchUser(user.id)
                            setShowProfileDropdown(false)
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-text-primary hover:bg-bg-raised transition-colors"
                        >
                          <div>{user.name}</div>
                          <div className="text-xs text-text-tertiary">({user.role})</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation with thin white border */}
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8 border-t border-border pt-3 pb-3">
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
        {activeTab === 'profile' && <UserProfile />}
      </main>

      <footer className="bg-bg-base border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-center text-sm text-text-tertiary font-light">
              Built by Sydney Chin & Bob • IBM Infrastructure Sales Team
            </p>
            <p className="text-center text-xs text-text-tertiary font-light">
              © 2026 IBM Corporation • Built June 2026 • Version 1.0.0
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

// Made with Bob
