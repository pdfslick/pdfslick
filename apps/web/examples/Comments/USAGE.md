# PDF Annotation System - Usage Guide

## Overview

This document provides instructions for using the PDF annotation system. The system allows users to place pins on PDF documents, add comments to those pins, and engage in threaded discussions directly on the document.

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Standard Workflow](#standard-workflow)
4. [Comment Sidebar Toggle](#comment-sidebar-toggle)
5. [Pin Placing Mode](#pin-placing-mode)
6. [Creating Comments](#creating-comments)
7. [Replying to Comments](#replying-to-comments)
8. [Removing Pins](#removing-pins)
9. [Removing Comments](#removing-comments)
10. [Data Persistence](#data-persistence)
11. [Summary](#summary)


---

## Getting Started

The annotation system provides two primary modes of interaction:

- **Comment Sidebar Toggle**: View and manage all comments in a dedicated sidebar
- **Pin Placing Mode**: Place new pins on the PDF document and interact with existing pins

Both modes can be accessed via the toolbar buttons at the top of the PDF viewer.

---

## Standard Workflow

This is a typical workflow for using the annotation system:

1. **Enable Comment Sidebar Toggle** by clicking the comment icon in the toolbar to open the sidebar
2. **Enable Pin Placing Mode** by clicking the pin icon in the toolbar
3. **Click on a location** in the PDF where you want to add an annotation
4. **Fill in your name and comment** in the form that appears
5. **Click "Save"** to create the comment
6. **View all comments** in the sidebar (already open from step 1)
7. **Reply to existing comments** by clicking on pins and using the Reply button
8. **Remove pins or comments** when they're no longer needed

---

## Comment Sidebar Toggle

### Activating Comment Sidebar Toggle

1. Locate the **comment icon** in the toolbar
2. Click the icon to toggle comment sidebar toggle **ON**
3. The comment sidebar will open on the right side of the viewer

### Features in Comment Sidebar Toggle

When comment sidebar toggle is active:

- **Comment Sidebar**: Displays all comments organized by their associated pins
- **Threaded Discussions**: View entire conversation threads for each pin
- **Comment Metadata**: See author names, timestamps, and page references

### Deactivating Comment Sidebar Toggle

Click the **comment icon** again to toggle comment sidebar toggle **OFF** and close the sidebar. It's also possible to close the sidebar using the "**X**" button.

---

## Pin Placing Mode

### Activating Pin Placing Mode

1. Locate the **pin icon** in the toolbar
2. Click the icon to toggle pin placing mode **ON**
3. All existing pins stored in browser local storage will become visible on the document

### Placing a New Pin

Once pin placing mode is active:

1. **Click** on any location in the PDF document where you want to place a pin
2. A pin will appear at the clicked position
3. The "Add a Comment" box will automatically open

### Pin Visibility

- Pins are represented as colored **location pins** on the document
- Pin colors can be customized using the color menu next to the pin icon
- Each pin corresponds to a specific location on a PDF page
- Pins persist across sessions via browser local storage

### Deactivating Pin Placing Mode

Click the **pin icon** again to toggle pin placing mode **OFF**. You can no longer place new pins, but existing pins will remain visible. Currently, there is no way to hide existing pins without deleting them.

---

## Creating Comments

### Adding Your First Comment

After placing a pin, the "Add a Comment" form appears automatically:

1. **Name Field**: Enter your name or identifier
   - This will be associated with all comments you create
   - Required field

2. **Comment Field**: Enter your comment content
   - Provide your feedback, question, or annotation
   - Required field

3. **Save Button**: Click "Save" to store the comment
   - The comment is saved to the pin
   - The comment appears in the comment sidebar (if open)
   - The form closes automatically

### Comment Structure

Each comment contains:
- Author name
- Timestamp (automatically generated)
- Comment content

Additionally stored in local storage:
- Association with a specific pin location
- Page number reference

---

## Replying to Comments

### Starting a Reply

To reply to an existing comment:

1. **Click on an existing pin** in the document
2. The comment box opens, displaying:
   - Original comment metadata (author, timestamp)
   - Comment content
   - Any existing replies in the thread

3. **Click the "Reply" button** in the comment box
4. The "Add a Comment" form appears

### Submitting a Reply

1. Enter your **name** in the name field
2. Enter your **reply content** in the comment field
3. Click **"Save"** (or click "Reply" again if the button text changes)
4. Your reply is saved and appears as a threaded comment below the original

### Threaded Conversations

- Replies are displayed in chronological order below the parent comment
- Each thread is grouped by its associated pin
- Threads can contain multiple replies from different users
- All replies in a thread share the same pin location

---

## Removing Pins

### How to Remove a Pin

Pins can be deleted directly from the document:

1. **Enable Pin Placing Mode** (click the pin icon in the toolbar)
   - This makes all existing pins visible and interactive

2. **Click on the pin** you want to remove
   - The pin becomes selected
   - Pin actions menu appears

3. **Click the delete button** (trash icon)
   - The pin is immediately removed from the document
   - All associated comments are also deleted
   - Changes are saved to local storage automatically

### When to Remove Pins

- Resolved discussions that are no longer needed
- Duplicate or incorrectly placed pins
- Outdated feedback or comments
- Cleaning up cluttered document views

---

## Removing Comments

### How to Remove Individual Comments

Individual comments can be deleted from the comment sidebar:

1. **Enable Comment Sidebar Toggle** (click the comment icon in the toolbar)
   - The comment sidebar opens

2. **Locate the comment** you want to delete
   - Browse through the comment threads
   - Use sorting options to find specific comments

3. **Click the delete button** (trash icon) next to the comment
   - The comment is immediately removed
   - Changes are saved to local storage automatically

### Comment Deletion Behavior

**Removing a Parent Comment:**
- Deletes the original comment
- May affect or remove the entire thread depending on implementation
- All replies associated with this comment may be affected

**Removing a Reply:**
- Deletes only the specific reply
- Parent comment and other replies remain intact
- Thread structure is preserved

### Alternative: Remove Via Pin

Comments can also be removed by deleting their associated pin:

1. Enable **Pin Placing Mode**
2. Click on the pin associated with the comments
3. Delete the pin using the delete button
4. All comments in that thread are removed

---

## Data Persistence

### Local Storage

All annotations and comments are stored in your browser's local storage:

- **Automatic Saving**: Comments are saved immediately upon submission
- **Session Persistence**: Data persists across browser sessions
- **Browser-Specific**: Data is local to your browser and device

### Data Structure

The system stores:
- **Annotations**: Pin locations and metadata (coordinates, page number, color)
- **Comments**: Comment content, author, timestamps, and thread relationships
- **Document References**: Associations between comments and specific documents

---

## Summary

The PDF annotation system provides a comprehensive solution for collaborative document review and discussion:

- **Comment Sidebar Toggle** to view and manage all comments via the sidebar
- **Toggle Pin Placing Mode** to add new annotations and view existing pins
- **Place pins** by clicking on the document in pin placing mode
- **Add comments** by filling in your name and content, then saving
- **Reply to comments** by clicking pins and using the reply function
- **Remove pins and comments** easily through intuitive interfaces

All data is stored locally in your browser, ensuring privacy and persistence across sessions.
