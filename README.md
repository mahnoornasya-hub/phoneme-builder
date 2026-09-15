# Phoneme Activity Builder

## About

The Phoneme Activity Builder is a full-stack web application developed to help Speech Pathology students and educators create phoneme-based learning activities.

Users can create and manage phoneme word lists, configure Wordle-style games and printable Word Search activities, preview activities in the browser, and export generated activities as standalone HTML files.

The application supports database-backed word lists, words, phonemes and activity configurations. Multi-character phonemes such as `tʃ` are stored and treated as a single phoneme unit.

This project was developed as part of CSE3CWA — Cloud Web Application at La Trobe University.

---

## Features

### Word Management

- Create, view, update and delete words
- Store an English word and optional hint
- Store an ordered phoneme sequence for each word
- Support single-character and multi-character phonemes
- Assign words to saved Word Lists

### Word List Management

- Create Word Lists
- View saved Word Lists
- Update Word Lists
- Delete Word Lists
- Load stored words and phonemes from the database

### Wordle Activity Builder

- Load saved words from the database
- Display one phoneme per game cell
- Support multi-character phonemes such as `tʃ`
- Configure difficulty
- Configure number of guesses
- Configure instructions and hints
- Save and update Wordle Activity Configurations
- Load previously saved Activity Configurations
- Live playable preview
- Export the generated activity as standalone HTML

### Word Search Activity Builder

- Load complete Word Lists from the database
- Generate a phoneme-based Word Search grid
- Support multi-character phonemes as individual grid units
- Place sequences in multiple directions
- Configure grid rows and columns
- Configure difficulty and instructions
- Save and update Word Search Activity Configurations
- Load previously saved Activity Configurations
- Live preview
- Export the generated worksheet as standalone HTML

### Other Features

- Responsive interface
- Light and dark mode settings
- About page
- Settings page
- Database-backed activity generation
- Server-side validation and error handling
- Health-check endpoint
- Docker support

---

## Technologies

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js Route Handlers
- Prisma ORM
- SQLite

### Deployment and Development

- Node.js
- npm
- Docker
- Git
- GitHub

---

## Database Design

The application uses Prisma ORM with SQLite.

The main database models are:

### WordList

Stores collections of words that can be used to generate activities.

A Word List can contain multiple Words and can be associated with multiple Activity Configurations.

### Word

Stores an English word, optional hint and its relationship to a Word List.

Each Word can contain multiple ordered Phoneme records.

### Phoneme

Stores individual phoneme units belonging to a Word.

The `position` field preserves the correct phoneme order.

For example:

```text
cheese
tʃ | iː | z
```

`tʃ` is stored as one phoneme rather than two separate characters.

### Activity

Stores reusable activity settings including:

- activity name
- activity type
- difficulty
- instructions
- hint
- number of guesses
- Word Search grid dimensions
- hint visibility
- associated Word List

The application supports both:

```text
WORDLE
WORD_SEARCH
```

This allows multiple Activity Configurations to be stored and loaded from the database.

### ActivityWord

Provides the many-to-many relationship between Activities and Words.

---

## API Routes

The application provides REST-style API routes for database operations.

### Words

```text
GET    /api/words
POST   /api/words
GET    /api/words/[id]
PUT    /api/words/[id]
DELETE /api/words/[id]
```

These routes provide CRUD operations for words and their phoneme sequences.

### Word Lists

```text
GET    /api/word-lists
POST   /api/word-lists
GET    /api/word-lists/[id]
PUT    /api/word-lists/[id]
DELETE /api/word-lists/[id]
```

These routes provide CRUD operations for saved Word Lists.

### Activities

```text
GET    /api/activities
POST   /api/activities
GET    /api/activities/[id]
PUT    /api/activities/[id]
DELETE /api/activities/[id]
```

These routes provide CRUD operations for Wordle and Word Search Activity Configurations.

---

## Validation and Error Handling

Server-side API validation is used before database operations are performed.

Examples include:

- activity names are required
- only supported activity types are accepted
- only valid difficulty values are accepted
- Word List IDs must be valid positive integers
- referenced Word Lists must exist
- Wordle guess counts must be positive whole numbers
- Word Search rows and columns must be positive whole numbers
- `showHints` must be a boolean value
- invalid resource IDs return appropriate errors
- missing database records return `404` responses

Unexpected server errors return appropriate `500` responses.

---

## Health Check

The application includes a health-check endpoint:

```text
GET /health
```

A successful request returns HTTP status `200` with:

```json
{
  "status": "ok",
  "service": "phoneme-builder"
}
```

This endpoint can also be used to verify that the application is running successfully inside Docker.

---

## Database-Driven Activity Generation

Both activity builders communicate with the backend APIs.

### Wordle

The Wordle Builder can retrieve a saved Word from the database. The stored ordered phonemes, English word and hint are loaded into the builder and used by the live preview and standalone HTML export.

Saved Wordle Activity Configurations can also restore settings such as difficulty, instructions, number of guesses, hint visibility and associated Word List.

### Word Search

The Word Search Builder can retrieve a saved Word List from the database.

The phoneme sequences belonging to the words in that list are used to generate the Word Search grid and standalone HTML worksheet.

Saved Word Search Activity Configurations can restore settings including difficulty, instructions, grid dimensions, hint visibility and associated Word List.

---

## Getting Started

### Requirements

Install:

- Node.js
- npm

For Docker deployment, Docker Desktop is also required.

### Install Dependencies

Clone the repository and install the required packages:

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Apply Database Migrations

For development:

```bash
npx prisma migrate dev
```

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Production Build

Create an optimized production build with:

```bash
npm run build
```

Start the production application with:

```bash
npm start
```

---

## Docker

The project includes a `Dockerfile` and `.dockerignore`.

The Docker image uses Node.js 22 and includes the system dependencies required for Prisma and `better-sqlite3`.

### Build Docker Image

From the project root:

```bash
docker build -t phoneme-builder .
```

### Run with Persistent SQLite Storage

Create and run the container with:

```bash
docker run -d --name phoneme-builder-container -p 3001:3000 -v phoneme-builder-data:/app/data phoneme-builder
```

Open:

```text
http://localhost:3001
```

Health check:

```text
http://localhost:3001/health
```

The named Docker volume:

```text
phoneme-builder-data
```

is mounted at:

```text
/app/data
```

This allows the SQLite database to persist even if the application container is deleted and recreated.

### View Running Containers

```bash
docker ps
```

### Stop Container

```bash
docker stop phoneme-builder-container
```

### Start Existing Container

```bash
docker start phoneme-builder-container
```

### Remove Container

```bash
docker rm phoneme-builder-container
```

The named volume remains separate from the container, allowing database data to persist.

---

## Project Structure

```text
phoneme-builder/
├── app/
│   ├── api/
│   │   ├── activities/
│   │   ├── word-lists/
│   │   └── words/
│   ├── about/
│   ├── manage-words/
│   ├── settings/
│   ├── word-search/
│   ├── wordle/
│   └── health/
├── components/
├── lib/
│   └── prisma.ts
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
├── Dockerfile
├── .dockerignore
├── package.json
├── prisma.config.ts
└── README.md
```

---

## Git Workflow

Development was completed using Git feature branches and regular commits.

The project repository contains the development history for the frontend, backend, database integration, Activity Configuration functionality, API validation and Docker implementation.

---

## Submission Notes

Generated dependency and build folders are not required in the submitted source-code archive.

The following folders should be excluded from the final submission ZIP:

```text
node_modules/
.next/
```

Local SQLite database files and environment files should also not be committed to the repository.

Dependencies can be restored using:

```bash
npm install
```

and the application can be rebuilt using:

```bash
npm run build
```

---

## Author

**Mahnoor Anasyabila Sohail**

Student ID: **21981775**

Bachelor of Software Engineering  
La Trobe University

**CSE3CWA — Cloud Web Application**