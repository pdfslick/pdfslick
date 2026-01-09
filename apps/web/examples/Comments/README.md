# Comments Example - Refactoring Summary

## Overview

This document summarizes the refactoring of the `PinButton` component.

## Before

`PinButton.tsx` was handling:
- Pin mode toggling
- Click detection for placing pins
- Pin rendering via portals
- Comment management
- Pin selection/deletion
- Color state

## After

### Component Structure

```
Comments/index.tsx          ← Main component (state + localStorage)
├── Toolbar/index.tsx       ← Toolbar container
│   └── PinButton.tsx       ← Just the toggle button + color menu
├── PinLayer.tsx            ← Renders all pins via React portals
│   └── PinPlacement.tsx    ← Single pin with position + interactions
│       ├── Pin.tsx         ← Visual colored dot (presentational)
│       ├── CommentForm.tsx ← Input form for new comments
│       └── PinActions.tsx  ← Actions when pin is selected
│           ├── PinDeleteButton.tsx
│           └── CommentOverlay.tsx
└── CommentSidebar.tsx      ← Sidebar with all comments
```

### Custom Hooks
`usePinPlacement` -> Handles click detection on PDF viewer, calculates coordinates, creates annotation objects

## File Renaming

| Old Name | New Name |
|----------|----------|
| `Comment.tsx` | `CommentForm.tsx` |
| `FloatingComment.tsx` | `CommentOverlay.tsx` |

## Files Created
- `Pin/Pin.tsx` - Visual pin dot
- `Pin/PinPlacement.tsx` - Single pin with position + interactions
- `Pin/PinLayer.tsx` - Multiple pin rendering
- `Pin/PinActions.tsx` - Selected pin actions
- `Pin/PinDeleteButton.tsx` - Delete button
- `Pin/hooks/usePinPlacement.tsx` - Click handling hook

## Future Plan

- Introduce `PinContext` / `CommentsContext` to eliminate prop drilling through multiple layers
- Extract state from `index.tsx` into custom hooks (`useAnnotations`, `useComments`)
