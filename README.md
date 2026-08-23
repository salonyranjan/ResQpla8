# ResQPlate

ResQPlate is a responsive food-rescue web application. People can create an account, post surplus food, browse currently available donations, claim food, and follow a rescue through its pickup status. Appwrite provides authentication, database storage, file storage, and realtime updates.

The application displays records returned by Appwrite. It does not seed demo donations or invented impact statistics.

## What works

- Email and password registration, login, session restoration, and logout
- Protected dashboard routes
- Food donation creation with an optional image
- Live listing of pending, unexpired donations
- Cart and checkout flow that claims available donations
- Pickup status and order tracking
- Dashboard analytics calculated from stored pickup records
- Realtime refresh when pickup documents change
- Public map built with Leaflet and OpenStreetMap tiles
- ResQBot guidance, with an optional Groq integration
- Optional EmailJS contact forms
- One shared light/dark theme
- Responsive desktop and mobile navigation

## Important data behavior

- A new donation is saved with the `pending` status and appears in the dashboard and food listing.
- Claiming food changes its status to `confirmed`, so it is no longer shown as available.
- Expired donations are hidden from the available-food listing.
- The browser does **not** delete completed or expired Appwrite documents. Keeping those records allows tracking and real analytics. If permanent automatic deletion is required, implement it as an Appwrite Function with a schedule and an API key that has the minimum required scope.

## Technology

- React 19
- Vite 7
- React Router 7
- Tailwind CSS 4 and component-level responsive styles
- Appwrite Web SDK
- Leaflet and React Leaflet
- Framer Motion
- Groq SDK for optional AI features
- EmailJS for optional contact forms

## Repository layout

```text
ResQPlate_frontend/
├── .github/workflows/       # Appwrite health check and console reminder
├── frontend/
│   ├── public/              # Public assets, including the canonical logo.svg
│   ├── src/
│   │   ├── components/      # Shared and public UI
│   │   ├── context/         # Authentication, cart, and theme state
│   │   ├── hooks/           # Tracking, alert, and volunteer data hooks
│   │   ├── layouts/         # Dashboard shell
│   │   ├── pages/           # Route-level screens
│   │   └── services/        # Appwrite, food data, and optional AI services
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- An Appwrite project

Groq and EmailJS accounts are optional. The core authentication and donation flows use Appwrite.

## Local setup

1. Clone the repository and open its frontend directory:

   ```bash
   git clone https://github.com/salonyranjan/frontend-ResQplate-.git
   cd frontend-ResQplate-/frontend
   ```

2. Install the locked dependencies:

   ```bash
   npm ci
   ```

3. Copy the environment template:

   macOS or Linux:

   ```bash
   cp .env.example .env
   ```

   Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Fill in the required Appwrite values in `frontend/.env`.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the URL printed by Vite, normally `http://localhost:5173`.

## Environment variables

Only variables prefixed with `VITE_` are available to browser code. They are bundled into the client and must never contain an Appwrite server API key or another privileged secret.

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_APPWRITE_ENDPOINT` | Yes | Appwrite API endpoint, such as `https://fra.cloud.appwrite.io/v1` |
| `VITE_APPWRITE_PROJECT_ID` | Yes | Appwrite project ID |
| `VITE_APPWRITE_DATABASE_ID` | Yes | Database containing the pickup collection |
| `VITE_APPWRITE_PICKUPS_COLLECTION_ID` | Yes | Pickup collection ID |
| `VITE_APPWRITE_BUCKET_ID` | No | Storage bucket for donation images |
| `VITE_GROQ_API_KEY` | No | Enables Groq-backed ResQBot and AI utilities |
| `VITE_EMAILJS_SERVICE_ID` | No | EmailJS service used by contact forms |
| `VITE_EMAILJS_TEMPLATE_ID` | No | EmailJS template used by the landing-page form |
| `VITE_EMAILJS_CONTACT_TEMPLATE_ID` | No | EmailJS template used by the contact page |
| `VITE_EMAILJS_PUBLIC_KEY` | No | EmailJS browser public key |

Example:

```env
VITE_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_PICKUPS_COLLECTION_ID=pickups
VITE_APPWRITE_BUCKET_ID=

VITE_GROQ_API_KEY=
VITE_EMAILJS_SERVICE_ID=
VITE_EMAILJS_TEMPLATE_ID=
VITE_EMAILJS_CONTACT_TEMPLATE_ID=
VITE_EMAILJS_PUBLIC_KEY=
```

`VITE_APPWRITE_ENDPOINT` and `VITE_APPWRITE_PROJECT_ID` are validated when the application starts. Database values are validated when a food-data feature is used.

### Client-side AI key warning

`VITE_GROQ_API_KEY` is currently read by browser code. A `VITE_` key is visible to users of the deployed site. For a public production deployment, move Groq calls to an Appwrite Function or another server-side endpoint and keep the secret there. Apply provider usage limits while the browser integration remains enabled.

## Appwrite configuration

### 1. Add web platforms

In the Appwrite Console, add every frontend hostname under the project's Web platforms. During development, add `localhost`. For deployment, add the exact production hostname.

Authentication can fail with an “unknown origin” error when the hostname is missing.

### 2. Enable email/password authentication

Enable the Email/Password authentication method in the Appwrite project.

### 3. Create the database and collection

Create a database and a collection, then place their IDs in `.env`. The frontend writes and reads the following pickup attributes:

| Attribute | Suggested type | Required |
| --- | --- | --- |
| `pickupId` | String | Yes |
| `pickupLocation` | String | Yes |
| `dropOffLocation` | String | No |
| `scheduledTime` | Datetime | Yes |
| `status` | String or enum | Yes |
| `vehicleType` | String | Yes |
| `donorId` | String | Yes |
| `weight` | Float | Yes |
| `mealsCount` | Integer | Yes |
| `foodType` | String, at least 250 characters | Yes |
| `location` | String | Yes |

Statuses currently understood by the UI are:

```text
pending
confirmed
preparing
out_for_delivery
completed
cancelled
```

Create indexes required by Appwrite for the queries used by the app:

- `status` for equality filtering
- `$createdAt` in descending order
- A combined index for `status` and `$createdAt` if the Appwrite Console requests it

### 4. Configure permissions

The application uses the logged-in user's browser session and does not use an API key. Configure collection permissions deliberately:

- Authenticated users need permission to create pickup documents.
- Users who browse food need permission to read the appropriate pickup documents.
- Claiming and status workflows require permission to update the relevant documents.

Use document security and per-document permissions before a public production launch if donors, receivers, and volunteers should have different access. Do not grant public update or delete access.

### 5. Optional image bucket

If `VITE_APPWRITE_BUCKET_ID` is set, create that Storage bucket and allow authenticated users to create files and intended users to read them. Donation image file IDs match their pickup document IDs. If the variable is empty, donations still work without image uploads.

## Routes

Public routes:

| Route | Screen |
| --- | --- |
| `/` | Landing page |
| `/about` | Project information |
| `/contact` | Contact page |
| `/map` | Food-rescue map |
| `/login` | Sign in |
| `/register` | Create an account |

Protected routes require a valid Appwrite session:

| Route | Screen |
| --- | --- |
| `/dashboard` | Operational overview |
| `/dashboard/donate` | Post surplus food |
| `/dashboard/search` | Browse available food |
| `/dashboard/orders` | Pickup activity |
| `/dashboard/analytics` | Analytics from Appwrite records |
| `/dashboard/smart-alerts` | Record-based activity alerts |
| `/dashboard/profile` | User profile |
| `/dashboard/settings` | Account settings |
| `/cart` | Selected donations |
| `/checkout` | Claim selected donations |
| `/tracking/:orderId` | Track one pickup document |

Unknown routes redirect to the landing page.

## Commands

Run commands from `frontend/`:

| Command | Result |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates the production build in `frontend/dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint across the frontend |

Recommended verification before a pull request:

```bash
npm run lint
npm run build
```

## Deployment

1. Set the deployment root directory to `frontend`.
2. Use `npm ci` as the install command.
3. Use `npm run build` as the build command.
4. Publish `frontend/dist` (or `dist` when the platform root is already `frontend`).
5. Add the required environment variables in the hosting dashboard.
6. Configure SPA fallback so unknown server paths serve `index.html`.
7. Add the deployed hostname as an Appwrite Web platform.

Never commit `frontend/.env`. It is ignored by Git.

## Appwrite Free project reminders

Two GitHub Actions are included:

- `appwrite-activity-check.yml` checks the configured Appwrite health endpoint every three days. Add repository secrets named `APPWRITE_ENDPOINT` and `APPWRITE_PROJECT_ID`.
- `appwrite-console-reminder.yml` opens a reminder issue on Monday and Thursday when no reminder is already open.

The health request verifies availability, but it may not count as Appwrite Console development activity. The reminder exists because a GitHub workflow cannot guarantee that a free Appwrite project will never be paused. Do not add an Appwrite password or server API key to these workflows.

## Troubleshooting

### App starts with “Appwrite is not configured”

Set `VITE_APPWRITE_ENDPOINT` and `VITE_APPWRITE_PROJECT_ID` in `frontend/.env`, then restart Vite.

### Login or registration reports an unknown origin

Add the current hostname to the project's Web platforms in Appwrite.

### Food listing or dashboard cannot load records

Check the database ID, collection ID, collection permissions, and required indexes. Confirm the collection attributes match the schema above.

### Donation uploads work without an image

This is expected when `VITE_APPWRITE_BUCKET_ID` is empty. Configure a bucket and its permissions to enable images.

### A claimed donation disappeared from Browse Food

This is expected. Claiming changes the document from `pending` to `confirmed`, and Browse Food only shows pending, unexpired donations.

### A deployed route returns 404 after refresh

Configure the host's single-page application fallback to serve `index.html`.

## Maintainer

Developed and maintained by [Salony Ranjan](https://github.com/salonyranjan).

Issues and contributions are welcome through the [GitHub repository](https://github.com/salonyranjan/frontend-ResQplate-).
