# ResQPlate rescue workflow

This Appwrite Function performs volunteer matching and protected state changes without exposing volunteer coordinates or granting broad client write access.

Deploy it with a Node.js runtime, set the entrypoint to `src/main.js`, allow execution by authenticated users, and grant its dynamic API key these scopes: `documents.read` and `documents.write`.

Add these function variables:

- `RESQPLATE_DATABASE_ID`
- `RESQPLATE_PICKUPS_COLLECTION_ID`
- `RESQPLATE_VOLUNTEERS_COLLECTION_ID`
- `RESQPLATE_NOTIFICATIONS_COLLECTION_ID`

Appwrite supplies `APPWRITE_FUNCTION_API_ENDPOINT`, `APPWRITE_FUNCTION_PROJECT_ID`, and a dynamic API key through the protected `x-appwrite-key` runtime header. After deployment, set the web app variable `VITE_APPWRITE_VOLUNTEER_FUNCTION_ID` to the function ID and rebuild the app.
