# Critical Fixes Needed

## Completed ✅
1. **Profile dropdown** - Removed Profile tab, added dropdown from user icon
2. **Nav spacing** - Fixed padding symmetry (pt-3 pb-3)
3. **Icon imports** - Added ArrowUp and ArrowDown for proper icons

## High Priority Fixes

### 1. Icon Fixes
- **Import icon**: Change from `Upload` to `ArrowDown` (pointing down)
- **Export icon**: Change from `Download` to `ArrowUp` (pointing up)
- Location: CadenceLibrary.jsx buttons around line 695-697 and 773-777

### 2. View Mode Tabs
- Change from 2 buttons (Active/Archived) to 3 tabs (Active/Drafts/Archived)
- Filter logic needs to handle 3 states:
  - Active: `!archived && status === 'published'`
  - Drafts: `!archived && status === 'draft'`
  - Archived: `archived === true`

### 3. Unpublish Button
- Currently shows in table row by default
- Should ONLY show when `selectMode === true`
- Location: Table body around line 1016-1031

### 4. Archive Auto-Unpublish
- When archiving, set `status: 'draft'` in addition to `archived: true`
- Update `handleArchiveCadence` and `handleBulkArchive` functions

### 5. Publish/Unpublish Confirmation
- Add `window.confirm()` before toggling publish status
- Update `togglePublishStatus`, `handlePublishCadence`, `handleSaveAsDraft` functions

### 6. Create Cadence Modal
- Issue: Modal state `showCreateModal` is managed correctly
- The problem might be in how the modal is triggered
- Verify the Create button onClick is calling `setShowCreateModal(true)` directly

### 7. Navigation to Emails Tab
- **View All Emails in Cadence**: 
  - Navigate to emails tab
  - Pass cadence ID as prop/context
  - Auto-expand first dropdown
- **View Emails at Step**:
  - Navigate to emails tab  
  - Pass cadence ID and step number
  - Auto-expand specific step dropdown

## Medium Priority Fixes

### 8. Save to Database
- Implement actual API call in save functionality
- Currently just shows alert
- Need to call backend `/api/feedback/save` endpoint

### 9. Regenerate Functionality
- Implement regenerate email logic
- Call AI generation API with same parameters
- Update UI with new email

### 10. Industry Editing in Cards
- Add edit button/icon next to industry in database cards
- Open inline edit or modal
- Save changes to database

### 11. Knowledge Base Explanation
- Add info icon or "How it works" button
- Modal explaining:
  - RAG (Retrieval-Augmented Generation)
  - How training examples are used
  - Ranking system
  - Feedback loop

## Complex Features

### 12. Rating System
- **Save ratings to profile**:
  - Add ratings array to user context
  - Store: `{ emailId, rating, timestamp, comment }`
  
- **Show in database**:
  - Display ratings with generated emails
  - Show rating score, comment, timestamp
  
- **Anonymization**:
  - If `currentUser.role !== 'Owner'`: hide rater name
  - Show "Anonymous" or just rating data
  
- **Fake data structure**:
```javascript
{
  emailId: '123',
  cadenceId: '4080797',
  stepNumber: 1,
  generatedEmail: '...',
  ratings: [
    {
      id: 'r1',
      userId: '1',
      userName: 'Sydney Chin',
      rating: 4,
      comment: 'Good personalization',
      timestamp: '2026-06-20T10:30:00Z'
    }
  ]
}
```

## Implementation Order

### Phase 1: Quick Fixes (30 min)
1. Fix import/export icons
2. Hide unpublish button (add selectMode check)
3. Add confirmation dialogs
4. Auto-unpublish on archive
5. Fix view mode tabs (Active/Drafts/Archived)

### Phase 2: Navigation (45 min)
6. Implement email tab navigation with context
7. Auto-expand dropdowns based on passed params
8. Update "View All" buttons to pass correct data

### Phase 3: Functionality (1 hour)
9. Fix save to database (API integration)
10. Implement regenerate
11. Add industry editing
12. Create knowledge base modal

### Phase 4: Rating System (1.5 hours)
13. Create rating data structure
14. Implement save ratings to profile
15. Display ratings in database
16. Add anonymization logic
17. Generate fake rating data

## Code Snippets

### Icon Fix
```jsx
// Import button
<button className="btn-purple flex items-center space-x-1.5 text-sm">
  <ArrowDown className="w-3.5 h-3.5" />
  <span>Import</span>
</button>

// Export button  
<button className="bg-bg-raised hover:bg-bg-elevated text-text-primary font-normal py-2 px-4 text-sm transition-all flex items-center space-x-2 border border-border">
  <ArrowUp className="w-4 h-4" />
  <span>Export</span>
</button>
```

### View Mode Tabs
```jsx
<div className="flex items-center gap-2">
  <button onClick={() => setViewMode('active')} className={...}>Active</button>
  <button onClick={() => setViewMode('drafts')} className={...}>Drafts</button>
  <button onClick={() => setViewMode('archived')} className={...}>Archived</button>
</div>
```

### Filter Logic
```javascript
useEffect(() => {
  let filtered = cadences;
  
  // Filter by view mode
  if (viewMode === 'active') {
    filtered = filtered.filter(c => !c.archived && c.status === 'published');
  } else if (viewMode === 'drafts') {
    filtered = filtered.filter(c => !c.archived && c.status === 'draft');
  } else if (viewMode === 'archived') {
    filtered = filtered.filter(c => c.archived);
  }
  
  // ... rest of filters
}, [searchTerm, filters, cadences, viewMode]);
```

### Confirmation Dialog
```javascript
const handlePublishCadence = (cadence) => {
  if (!canPublish(cadence)) {
    alert('You do not have permission to publish cadences');
    return;
  }
  
  if (confirm(`Are you sure you want to publish "${cadence.name}"?`)) {
    setCadences(prevCadences =>
      prevCadences.map(c =>
        c.id === cadence.id ? { ...c, status: 'published' } : c
      )
    );
  }
};
```

## Testing Checklist
- [ ] Import icon points down
- [ ] Export icon points up
- [ ] Unpublish only shows in select mode
- [ ] Archive auto-unpublishes
- [ ] Publish/unpublish asks for confirmation
- [ ] Three view tabs work correctly
- [ ] Create modal opens immediately
- [ ] Navigate to emails tab works
- [ ] Ratings save and display
- [ ] Anonymization works for non-owners
