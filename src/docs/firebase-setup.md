# Firebase Setup for Tasks Collection

## Current Status
Your Firebase is already configured and working for existing collections (export_tracking, import_tracking, domestic_trucking, all_files).

## New Tasks Collection
The new "tasks" collection will be automatically created when you add your first task. Firebase will:

1. **Auto-create the collection** when you add the first task
2. **Set up the document structure** with these fields:
   - `id` (auto-generated)
   - `description` (string)
   - `dueDate` (string in YYYY-MM-DD format)
   - `assignedTo` (string)
   - `completed` (boolean)
   - `userId` (string)
   - `createdAt` (timestamp)
   - `updatedAt` (timestamp)

## Security Rules
If you need to update Firestore security rules for the tasks collection, add this to your Firebase Console -> Firestore -> Rules:

```javascript
// Allow read/write access to tasks collection for authenticated users
match /tasks/{taskId} {
  allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
}
```

## Testing
1. Go to the Calendar View
2. Navigate to the Weekly View
3. Click "Add Task" under any day
4. Fill in the task details and submit
5. The task will appear in Firebase and sync to your calendar

## Troubleshooting
If tasks aren't appearing:
1. Check browser console for errors
2. Verify your Firebase connection is working (other data loads)
3. Check that userId is being passed correctly
4. Ensure you're logged in if authentication is required

## Recent Fixes Applied
- ✅ Fixed task filtering in weekly view - tasks now show when "Tasks" or "All Events" is selected
- ✅ Improved task form styling - now shows as a single cohesive card with proper labels
- ✅ Tasks now properly sync to calendar events and appear in both weekly and daily views
- ✅ Task filtering works correctly with calendar navigation