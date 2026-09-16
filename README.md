# The Analog Rolodex — Tactile Paper Address Book

A full-stack, artisanal Contact Management Web Application built with **React**, **Node.js + Express**, and **MongoDB (Mongoose)**. Designed with a warm, stationery-inspired aesthetic reminiscent of a vintage mid-century desk Rolodex and handcrafted leather-bound address ledger.

---

## 📖 Overview

The **Analog Rolodex** is the opposite of sterile, dark neon/glass tech SaaS dashboards. It reimagines contact management through the lens of physical stationery:
- **Warm cream & parchment backgrounds** (`#f4ecd8`) layered over subtle noise textures and notebook grid lines.
- **Deep espresso-brown typography** (`#3b2a1e`) set in elegant serif headings (**Fraunces**, **DM Serif Display**) and warm rounded body type (**Nunito**).
- **Tactile stationery motifs**: Manila index cards, brass rivets and star pins, washi tape corners, embossed wax seal avatars, stitched borders, and perforated tear-out edges.
- **Micro-interactions**: 3D card tilt & lift physics on hover, rotary wheel flipping, ink-stamp button depressions, and stamped note notifications.

---

## 🎨 Design System & Color Palette

| Token | Hex / Value | Role |
| :--- | :--- | :--- |
| **Parchment Base** | `#f4ecd8` | Main page desk background |
| **Parchment Light** | `#fbf7ee` | Form panels, modals & search card |
| **Manila Card** | `#faeed7` | Rolodex index cards |
| **Espresso Brown** | `#3b2a1e` | Primary text and ink borders |
| **Sage Green** | `#7a8c6f` | Primary accents, save actions, success toasts |
| **Muted Coral** | `#d97757` | Destructive actions, tear-out alerts, warnings |
| **Mustard Gold** | `#e0a750` | Starred favorites, highlights, washi tape |
| **Vintage Navy** | `#4a637d` | Secondary badges, email dispatches |
| **Brass Plaque** | `#b89758` | Embossed header branding & desk rivets |

---

## 🌟 Key Features

### 1. Dual Viewing Experiences
- **Interactive 3D Rolodex Rotary Carousel**: Flip through contacts using rotary knobs or keyboard arrow keys, jump to any letter with alphabetical A–Z index tabs, and view card index counters.
- **Desk Organizer Card Grid**: Responsive 3–4 column grid of tactile index cards with wax seal monograms, ruled lines, favorite star pins, and quick action buttons.

### 2. Full CRUD Capabilities
- **Create**: Stitched-border lined paper drawer with live real-time ink validation, customizable wax seal tints, preset category tags (Work, Family, Friends, VIP, Creative, Supplier), custom tag input, and celebratory stamp feedback.
- **Read**: Instant search by Name, Email, Phone, Company, Address, or Notes; filter by category shelf; filter by starred favorites; sort by Name (A-Z / Z-A), Date Inscribed, or Company.
- **Detail Dossier**: Full-screen paper dossier with direct clickable telephone (`tel:`), email (`mailto:`), Google Maps links, clipboard copy with parchment feedback, and single-contact vCard export.
- **Update**: Pre-filled revision ledger for existing contacts with unique email verification and optimistic UI updates.
- **Delete ("Tear Out Page")**: Modal with perforated edge and tear warning to confirm before permanently removing a contact.

### 3. Data Export & Portability
- **vCard (.vcf) Export**: Export individual contacts or the entire Rolodex to universal vCard 3.0 format for Apple Contacts, Google Contacts, or Outlook.
- **CSV Ledger Export**: Export all contacts to structured CSV spreadsheets.

### 4. Zero-Config Resilient Backend
- Connects seamlessly to any MongoDB instance (`MONGODB_URI`).
- Includes an automatic fallback in-memory document store in development if no local MongoDB service is running, ensuring instant evaluation with zero setup friction.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **React 18** (Functional components, hooks)
- **Vite** (Next-generation frontend tooling)
- **Axios** (Centralized API client with interceptors)
- **Vanilla CSS** (Custom paper theme tokens, animations, 3D rotary transforms)
- **Lucide React** (Tactile action icons)
- **Canvas Confetti** (Stamp celebration effects)
- **Google Fonts** (Fraunces, DM Serif Display, Nunito, Caveat, Special Elite)

### Backend (`/server`)
- **Node.js** & **Express**
- **MongoDB** & **Mongoose** (ODM, custom schema validators, indexes)
- **Express-Validator** (Server-side request sanitization and schema validation)
- **Morgan** (HTTP request logging)
- **CORS** & **Dotenv**

---

## 📂 Project Structure

```
contact-management-app/
├── package.json                 # Root unified runners (concurrently)
├── .env.example                 # Environment variable templates
├── README.md                    # Complete documentation & API specification
├── server/
│   ├── package.json             # Server dependencies & scripts
│   ├── server.js                # Express app entry & middleware stack
│   ├── test-api.js              # Automated test suite verifying all 10 API cases
│   ├── .env                     # Server environment config
│   ├── config/
│   │   └── db.js                # Resilient MongoDB connection & memory fallback
│   ├── models/
│   │   └── Contact.js           # Mongoose Contact schema with validations & indexes
│   ├── routes/
│   │   └── contacts.js          # REST API endpoints (CRUD, search, tags, seed)
│   ├── middleware/
│   │   ├── validate.js          # express-validator schemas & error formatters
│   │   └── errorHandler.js      # Centralized JSON error handler
│   └── data/
│       ├── sampleContacts.js    # Vintage curated sample contacts
│       └── contactStore.js      # In-memory document storage engine
└── client/
    ├── package.json             # Client dependencies & scripts
    ├── vite.config.js           # Vite dev server with /api proxy
    ├── index.html               # Google Fonts & SEO metadata
    └── src/
        ├── main.jsx             # React DOM root entry
        ├── App.jsx              # Main app view coordinator & modals
        ├── styles/
        │   ├── index.css        # Theme variables, typography, custom scrollbars
        │   ├── paper-theme.css  # Ruled lines, wax seals, washi tape, stamps, stitches
        │   └── components.css   # Headers, cards, forms, modals, responsive grid
        ├── services/
        │   └── api.js           # Axios client wrapper with typed API methods
        ├── hooks/
        │   ├── useContacts.js   # Unified CRUD, search, filter, and modal state
        │   └── useToast.js      # Stamped notifications dispatcher
        ├── utils/
        │   ├── formatters.js    # Initials, vintage date, phone cleaner
        │   └── exportUtils.js   # vCard (.vcf) and CSV generators
        └── components/
            ├── Header.jsx             # Brass header, live clock, counters, export menu
            ├── SearchBar.jsx          # DYMO sticker search, sort dropdown, tag ribbons
            ├── RolodexView.jsx        # 3D rotary flip carousel with A-Z tabs
            ├── CardGridView.jsx       # Desk organizer card grid
            ├── ContactCard.jsx        # Index card with wax seal, pin, and actions
            ├── ContactDetailModal.jsx  # Full paper dossier with copy feedback
            ├── ContactFormModal.jsx    # Add/Edit form with ink validation & wax picker
            ├── DeleteConfirmModal.jsx  # "Tear out page" modal with perforated edge
            ├── ToastContainer.jsx     # Slide-in stamped notes
            ├── SkeletonCard.jsx       # Shimmering index card loading skeleton
            ├── EmptyState.jsx         # Illustrated empty rolodex & search reset
            ├── ErrorState.jsx         # Coffee-stained note with retry button
            └── Icons.jsx              # Custom hand-drawn style SVG icons
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** (v18+ recommended)
- **npm** (v9+ recommended)
- *(Optional)* Local or Atlas MongoDB URI (default connects to local or in-memory)

### Quick Start (Run Both Client & Server Concurrently)

1. **Clone or Navigate to the Workspace Directory**:
   ```bash
   cd "Contact Managment Task 3"
   ```

2. **Install All Dependencies**:
   ```bash
   npm run install:all
   ```

3. **Start Both Dev Servers**:
   ```bash
   npm run dev
   ```
   - **Frontend**: Accessible at [http://localhost:3000](http://localhost:3000)
   - **Backend API**: Accessible at [http://localhost:5000/api](http://localhost:5000/api)

---

### Manual Setup (Running Individually)

#### 1. Server Setup
```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

#### 2. Client Setup
```bash
cd client
npm install
npm run dev
```
The client will start on `http://localhost:3000` with auto-proxy to the backend API.

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000/api`

### 1. Contacts Endpoints

#### `GET /api/contacts`
Retrieve contacts with optional search query, tag filtering, favorite filtering, and sorting.
- **Query Parameters**:
  - `search` *(string, optional)*: Text query matched across Name, Email, Phone, Company, Address, Notes.
  - `tag` *(string, optional)*: Filter by category tag (e.g. `Work`, `Family`, `VIP`).
  - `favorite` *(boolean, optional)*: `true` to show only starred favorites.
  - `sort` *(string, optional)*: `name-asc` (default), `name-desc`, `newest`, `oldest`, `company`.
- **Response Shape (200 OK)**:
  ```json
  {
    "success": true,
    "count": 8,
    "total": 8,
    "data": [
      {
        "_id": "65e23f17234dbcff5a17",
        "name": "Arthur Pendelton",
        "email": "arthur.pendelton@vintagebinding.com",
        "phone": "+1 (555) 234-8901",
        "address": "42 Old Quill Lane, Oxford, OX1 2BE",
        "company": "Pendelton Rare Books & Binding",
        "jobTitle": "Master Bookbinder",
        "tags": ["Work", "VIP"],
        "notes": "Handles custom leather-bound journals and gold-leaf embossed notebooks.",
        "isFavorite": true,
        "avatarColor": "#7a8c6f",
        "createdAt": "2026-09-15T18:37:53.801Z",
        "updatedAt": "2026-09-15T18:37:53.801Z",
        "initials": "AP"
      }
    ]
  }
  ```

#### `GET /api/contacts/:id`
Retrieve a single contact dossier by ID.
- **Response Shape (200 OK)**:
  ```json
  {
    "success": true,
    "data": { ...contact }
  }
  ```

#### `POST /api/contacts`
Inscribe a new contact into the Rolodex.
- **Request Body**:
  ```json
  {
    "name": "Charles Dickens",
    "email": "charles.dickens@victorianlit.co.uk",
    "phone": "+44 20 7123 4567",
    "company": "Daily News & Household Words",
    "jobTitle": "Author & Journalist",
    "address": "48 Doughty Street, London, WC1N 2LX",
    "tags": ["Creative", "VIP"],
    "notes": "Prefers blue ink manuscripts and flexible cursive nibs.",
    "isFavorite": true,
    "avatarColor": "#5a738e"
  }
  ```
- **Response Shape (201 Created)**:
  ```json
  {
    "success": true,
    "message": "\"Charles Dickens\" was successfully inscribed into your Rolodex.",
    "data": { ...savedContact }
  }
  ```

#### `PUT /api/contacts/:id`
Update an existing contact record.
- **Response Shape (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Ledger entry for \"Charles Dickens\" updated successfully.",
    "data": { ...updatedContact }
  }
  ```

#### `PATCH /api/contacts/:id/favorite`
Toggle the favorite star on a contact.
- **Response Shape (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Pinned \"Charles Dickens\" to favorites.",
    "data": { ...contact }
  }
  ```

#### `DELETE /api/contacts/:id`
Permanently remove (tear out page) a contact from the Rolodex.
- **Response Shape (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Page for \"Charles Dickens\" torn out and removed from Rolodex.",
    "data": {
      "id": "65e23f17234dbcff5a17",
      "name": "Charles Dickens"
    }
  }
  ```

#### `GET /api/contacts/tags/all`
Retrieve distinct tags and their contact counts.
- **Response Shape (200 OK)**:
  ```json
  {
    "success": true,
    "data": [
      { "name": "Work", "count": 4 },
      { "name": "Creative", "count": 3 },
      { "name": "VIP", "count": 2 }
    ]
  }
  ```

#### `POST /api/contacts/seed`
Seed default vintage sample contacts into the database. Pass `?force=true` to reset.

#### `GET /api/health`
Healthcheck endpoint returning server status.

---

## 🛡️ Validation & Error Response Formats

Both frontend and backend enforce strict validation rules:
- **`name`**: Required, length between 2 and 100 characters.
- **`email`**: Required, valid email format (RFC 5322), unique index across contacts.
- **`phone`**: Required, valid international or local phone format (7–16 digits).
- **`address`**: Optional, max 250 characters.
- **`company`**: Optional, max 100 characters.
- **`notes`**: Optional, max 1000 characters.
- **`tags`**: Optional, max 8 tags per contact.

### Consistent JSON Error Shape
```json
{
  "success": false,
  "message": "Validation failed. Please check the ink on your form.",
  "errors": {
    "email": "Please provide a valid email address (e.g. name@domain.com).",
    "phone": "Please enter a valid phone number (e.g. +1 (555) 019-2834)."
  }
}
```

### Conflict Error (Duplicate Email)
```json
{
  "success": false,
  "message": "A contact with the email 'arthur.pendelton@vintagebinding.com' is already filed in your Rolodex.",
  "errors": {
    "email": "This email is already in use by another contact."
  }
}
```

### Resource Not Found (404)
```json
{
  "success": false,
  "message": "Contact entry not found in Rolodex with ID: 65e23f17234dbcff5a17"
}
```

---

## 🧪 Automated Testing

Run the automated backend test suite with:
```bash
node server/test-api.js
```
The test suite verifies all 10 API requirements including CRUD, duplicate email rejection (409), input validation (400), malformed ID rejection (400), favorite toggling, tag aggregation, and health checks.

---

## 📜 License
Handcrafted with care. Open-source under the MIT License.
