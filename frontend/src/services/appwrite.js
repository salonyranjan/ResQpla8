import { Client, Databases, Account } from 'appwrite';

// Initialize the Appwrite client
const client = new Client();
client
  // Appwrite endpoint URL (e.g., http://localhost/v1). Use NEXT_PUBLIC_ env vars for Next.js exposure.
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'http://localhost/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || 'YOUR_PROJECT_ID');

// Export reusable instances
export const databases = new Databases(client);
export const account = new Account(client);
export default client;
