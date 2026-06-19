# Chrome Extension Migration Plan

Technical plan for converting the web application into a Chrome extension that integrates directly with Salesloft.

## Overview

The Chrome extension will allow sales reps to generate personalized cadences directly within the Salesloft interface, eliminating the need to copy/paste between applications.

## Architecture

```
┌─────────────────────────────────────┐
│     Salesloft Web Interface         │
│  (cadence builder, prospect pages)  │
└──────────────┬──────────────────────┘
               │
               │ Content Script Injection
               │
┌──────────────▼──────────────────────┐
│      Chrome Extension                │
│  ┌────────────────────────────────┐ │
│  │  Content Script                │ │
│  │  - Detect Salesloft pages      │ │
│  │  - Extract prospect/company    │ │
│  │  - Inject UI elements          │ │
│  └────────────┬───────────────────┘ │
│               │                      │
│  ┌────────────▼───────────────────┐ │
│  │  Background Service Worker     │ │
│  │  - API communication           │ │
│  │  - State management            │ │
│  └────────────┬───────────────────┘ │
│               │                      │
│  ┌────────────▼───────────────────┐ │
│  │  Popup UI (React)              │ │
│  │  - Quick generate interface    │ │
│  │  - Settings                    │ │
│  └────────────────────────────────┘ │
└──────────────┬──────────────────────┘
               │
               │ HTTPS
               │
┌──────────────▼──────────────────────┐
│   Hosted Backend API                 │
│   (Vercel/Railway)                   │
│   - Same Express API                 │
│   - Azure OpenAI integration         │
└──────────────────────────────────────┘
```

## Phase 1: Extension Foundation (Week 1)

### 1.1 Manifest V3 Setup

**File**: `chrome-extension/manifest.json`

```json
{
  "manifest_version": 3,
  "name": "IBM Fusion Cadence Generator",
  "version": "1.0.0",
  "description": "Generate personalized sales cadences directly in Salesloft",
  "permissions": [
    "storage",
    "activeTab",
    "scripting"
  ],
  "host_permissions": [
    "https://*.salesloft.com/*",
    "https://your-api.vercel.app/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["https://*.salesloft.com/*"],
      "js": ["content.js"],
      "css": ["content.css"]
    }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

### 1.2 Content Script (Salesloft Detection)

**File**: `chrome-extension/content.js`

```javascript
// Detect Salesloft cadence builder page
function isCadencePage() {
  return window.location.href.includes('salesloft.com/cadences');
}

// Extract prospect information from Salesloft page
function extractProspectInfo() {
  // Salesloft-specific selectors (will need to be updated based on actual DOM)
  const prospectName = document.querySelector('[data-prospect-name]')?.textContent;
  const companyName = document.querySelector('[data-company-name]')?.textContent;
  
  return { prospectName, companyName };
}

// Inject "Generate with IBM Fusion" button
function injectGenerateButton() {
  if (document.getElementById('ibm-fusion-generate-btn')) return;
  
  const targetElement = document.querySelector('.cadence-actions'); // Adjust selector
  if (!targetElement) return;
  
  const button = document.createElement('button');
  button.id = 'ibm-fusion-generate-btn';
  button.className = 'ibm-fusion-btn';
  button.innerHTML = '✨ Generate with IBM Fusion';
  button.onclick = handleGenerateClick;
  
  targetElement.appendChild(button);
}

// Handle generate button click
async function handleGenerateClick() {
  const { prospectName, companyName } = extractProspectInfo();
  
  if (!prospectName || !companyName) {
    alert('Please ensure prospect and company information is visible on the page');
    return;
  }
  
  // Send message to background script
  chrome.runtime.sendMessage({
    action: 'generateCadences',
    data: { prospectName, companyName }
  });
}

// Initialize
if (isCadencePage()) {
  injectGenerateButton();
}
```

### 1.3 Background Service Worker

**File**: `chrome-extension/background.js`

```javascript
const API_BASE_URL = 'https://your-api.vercel.app/api';

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'generateCadences') {
    generateCadences(request.data)
      .then(result => sendResponse({ success: true, data: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
});

// Call backend API
async function generateCadences({ prospectName, companyName }) {
  const response = await fetch(`${API_BASE_URL}/cadence/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prospectName, companyName })
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate cadences');
  }
  
  return await response.json();
}

// Store generated cadences
chrome.storage.local.set({ lastGenerated: cadences });
```

### 1.4 Popup UI (React)

**File**: `chrome-extension/popup/Popup.jsx`

```jsx
import React, { useState, useEffect } from 'react';

function Popup() {
  const [cadences, setCadences] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load last generated cadences
    chrome.storage.local.get(['lastGenerated'], (result) => {
      if (result.lastGenerated) {
        setCadences(result.lastGenerated);
      }
    });
  }, []);

  const handleQuickGenerate = async () => {
    setLoading(true);
    
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, { action: 'extractAndGenerate' }, (response) => {
      if (response.success) {
        setCadences(response.data);
      }
      setLoading(false);
    });
  };

  return (
    <div className="popup-container">
      <h2>IBM Fusion Cadence Generator</h2>
      <button onClick={handleQuickGenerate} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Cadences'}
      </button>
      {cadences && <CadencePreview cadences={cadences} />}
    </div>
  );
}
```

## Phase 2: Auto-Population (Week 2)

### 2.1 Inject Cadence Steps into Salesloft

```javascript
// content.js - Auto-populate function
function populateCadenceSteps(cadences) {
  const selectedCadence = cadences[0]; // Or let user choose
  
  selectedCadence.steps.forEach((step, index) => {
    const stepElement = document.querySelector(`[data-step-index="${index}"]`);
    if (!stepElement) return;
    
    // Populate subject line
    const subjectInput = stepElement.querySelector('[name="subject"]');
    if (subjectInput && step.subject) {
      subjectInput.value = step.subject;
      subjectInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Populate body
    const bodyInput = stepElement.querySelector('[name="body"]');
    if (bodyInput && step.body) {
      bodyInput.value = step.body;
      bodyInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    // Set channel
    const channelSelect = stepElement.querySelector('[name="channel"]');
    if (channelSelect) {
      channelSelect.value = step.channel.toLowerCase();
      channelSelect.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
}
```

### 2.2 Modal UI for Cadence Selection

```javascript
// Show modal with all three cadences
function showCadenceModal(cadences) {
  const modal = document.createElement('div');
  modal.id = 'ibm-fusion-modal';
  modal.innerHTML = `
    <div class="modal-overlay">
      <div class="modal-content">
        <h2>Select Cadence to Apply</h2>
        ${cadences.map((cadence, i) => `
          <div class="cadence-option" data-index="${i}">
            <h3>${cadence.name}</h3>
            <p>${cadence.valueProposition}</p>
            <button onclick="applyCadence(${i})">Apply This Cadence</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}
```

## Phase 3: Advanced Features (Week 3)

### 3.1 Settings Page

```javascript
// options.html - Extension settings
- API endpoint configuration
- Default cadence preferences
- Auto-generate on page load option
- Keyboard shortcuts
```

### 3.2 Context Menu Integration

```javascript
// manifest.json - Add context menu
"permissions": ["contextMenus"],

// background.js
chrome.contextMenus.create({
  id: "generateCadence",
  title: "Generate IBM Fusion Cadence",
  contexts: ["selection"]
});
```

### 3.3 Keyboard Shortcuts

```javascript
// manifest.json
"commands": {
  "generate-cadence": {
    "suggested_key": {
      "default": "Ctrl+Shift+G",
      "mac": "Command+Shift+G"
    },
    "description": "Generate cadence for current prospect"
  }
}
```

## Technical Considerations

### Security

1. **Content Security Policy**:
```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'self'"
}
```

2. **API Authentication**:
- Store API keys securely in `chrome.storage.sync`
- Use HTTPS only
- Implement token refresh

3. **Data Privacy**:
- No prospect data stored locally
- Clear cache on logout
- Comply with IBM data policies

### Performance

1. **Lazy Loading**: Load React components on demand
2. **Caching**: Cache generated cadences for 24 hours
3. **Debouncing**: Debounce auto-extract functions
4. **Background Processing**: Use service worker for API calls

### Compatibility

1. **Salesloft Updates**: Monitor for DOM changes
2. **Browser Support**: Chrome 88+, Edge 88+
3. **Fallback UI**: If injection fails, show popup

## Development Workflow

### Local Development

```bash
# Build extension
cd chrome-extension
npm run build

# Load in Chrome
1. Go to chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select chrome-extension/dist folder
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests with Puppeteer
npm run test:e2e

# Test in Salesloft sandbox
```

### Deployment

```bash
# Build for production
npm run build:prod

# Create ZIP for Chrome Web Store
npm run package

# Submit to Chrome Web Store
# (Requires IBM developer account)
```

## Migration Checklist

- [ ] Convert React app to extension popup
- [ ] Implement content script for Salesloft
- [ ] Set up background service worker
- [ ] Test prospect data extraction
- [ ] Implement auto-population
- [ ] Add settings page
- [ ] Test in Salesloft production
- [ ] Security review
- [ ] Submit to Chrome Web Store
- [ ] Create user documentation
- [ ] Train sales team

## Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1: Foundation | 1 week | Basic extension, content script, API integration |
| Phase 2: Auto-populate | 1 week | Inject cadences into Salesloft, modal UI |
| Phase 3: Polish | 1 week | Settings, shortcuts, error handling |
| Testing & Review | 1 week | QA, security review, documentation |

**Total**: 4 weeks from web app to production extension

## Future Enhancements

- **Offline Mode**: Cache common responses
- **Analytics**: Track usage and success rates
- **A/B Testing**: Test different cadence variations
- **CRM Integration**: Pull data from Salesforce
- **Mobile Support**: iOS/Android apps

---

**Last Updated**: June 19, 2026  
**Version**: 1.0.0