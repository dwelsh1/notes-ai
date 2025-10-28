# Title Field Implementation Plan

## Problem

Currently, pages have a generic "Untitled Page" or "Current Page" title with no way to set a proper title. Users expect a Notion-style title field at the top of the editor.

## Solution

Implement a title field that:

1. Appears at the top of the editor
2. Stores the title in the page's `title` field in the database
3. Syncs with the first heading or becomes the first heading in the editor
4. Updates the sidebar display in real-time

## Implementation Options

### Option 1: Title Above BlockNote Editor (Recommended)

- Add a separate input field above the BlockNote editor
- Store title separately in database
- Sync with first heading in editor content

**Pros:**

- Simple to implement
- Clear separation between title and content
- Notion-like user experience

**Cons:**

- Requires a separate input field
- Needs to sync with first heading

### Option 2: Custom BlockNote Block

- Create a custom "Title" block type in BlockNote
- Always stays as first block
- Can't be deleted or moved

**Pros:**

- Integrated with BlockNote
- More complex to implement

**Cons:**

- Requires BlockNote customization
- Limited by BlockNote's architecture

## Recommended Approach: Option 1

### Implementation Steps

1. **Update App.tsx**
   - Add a `pageTitle` state variable
   - Add a title input field above the BlockNote editor
   - Extract title from first heading or use input
   - Update database when title changes

2. **Update Sidebar**
   - Display the title from the `title` field
   - Fallback to "Untitled Page" if no title

3. **Update API**
   - Ensure title field is saved correctly
   - Update title on page save

### Title Input Field Design

```tsx
<input
  type="text"
  placeholder="Untitled Page"
  value={pageTitle}
  onChange={e => setPageTitle(e.target.value)}
  onBlur={handleTitleBlur}
  style={{
    fontSize: '40px',
    fontWeight: 'bold',
    border: 'none',
    outline: 'none',
    padding: '16px',
    width: '100%',
  }}
/>
```

## Next Steps

1. Add title input field to App.tsx
2. Update save function to include title
3. Update load function to display title
4. Test with Notion-style workflow
