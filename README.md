# Phoneme Activity Builder

## Overview

Phoneme Activity Builder is a full-stack web application developed for Speech Pathology students and educators to create, manage and generate phoneme-based learning activities.

The application provides two activity builders:

- Phoneme Wordle
- Phoneme Word Search

Users can manage phoneme words and reusable word lists, configure activity settings, preview generated activities and save activity configurations to a database.

The application also includes an operational dashboard that reports activity usage, generation performance, stored content statistics and application health.

This project was developed for **CSE3CWA — Cloud Web Application** at La Trobe University.

---

## Core Features

### Word Management

The Manage Words interface provides database-backed CRUD operations for phoneme content.

Users can:

- Create, view, update and delete words
- Store an English word and optional hint
- Store ordered phoneme sequences
- Support multi-character phonemes such as `tʃ`
- Assign words to reusable Word Lists
- Create, update and delete Word Lists
- Load stored content from the database

Phonemes are stored as individual ordered records rather than splitting them into individual characters. This allows phonemes such as `tʃ` to behave as a single unit throughout the application.

### Phoneme Wordle

The Wordle Builder supports:

- Database-backed word selection
- One phoneme per game cell
- Multi-character phonemes
- Difficulty configuration
- Configurable number of guesses
- Instructions and hints
- Hint visibility
- Live playable preview
- Saved Activity Configurations
- Standalone HTML generation
- Generation success and failure tracking
- Page usage tracking

### Phoneme Word Search

The Word Search Builder supports:

- Database-backed Word Lists
- Phoneme-based puzzle generation
- Multi-character phonemes as individual grid units
- Multiple placement directions
- Configurable rows and columns
- Difficulty configuration
- Instructions and hints
- Saved Activity Configurations
- Live preview
- Standalone HTML generation
- Generation success and failure tracking
- Page usage tracking

---

## Technical Stack

### Frontend

- Next.js 16
- React
- TypeScript
- Tailwind CSS

### Backend

- Next.js App Router
- Next.js Route Handlers
- Prisma ORM
- SQLite

### Testing and Quality

- Playwright
- Apache JMeter
- Google Lighthouse

### Development and Deployment

- Node.js
- npm
- Docker
- Git
- GitHub

---

## Application Architecture

The project uses a full-stack Next.js architecture.

```text
Client Interface
      |
      v
Next.js App Router
      |
      v
Route Handlers / REST APIs
      |
      v
Prisma ORM
      |
      v
SQLite Database
```

The frontend communicates with server-side Route Handlers using HTTP requests. Database access is handled through Prisma rather than directly from client components.

Operational usage data follows a similar flow:

```text
Wordle / Word Search
        |
        v
Usage Events API
        |
        v
UsageEvent Records
        |
        v
Dashboard API
        |
        v
Reporting Dashboard
```

This keeps the activity builders separate from the reporting logic while allowing the dashboard to report data collected during normal application use.

---

## Application Routes

The main user-facing routes are:

| Route | Purpose |
|---|---|
| `/` | Application home page |
| `/wordle` | Phoneme Wordle Builder |
| `/word-search` | Phoneme Word Search Builder |
| `/manage-words` | Word and Word List management |
| `/dashboard` | Operational and reporting dashboard |
| `/settings` | User interface settings |
| `/about` | Project information |
| `/health` | Application health check |

---

## Database Design

The application uses **Prisma ORM with SQLite**.

The main database models are:

### WordList

Stores reusable collections of words.

A Word List can contain multiple Words and can be associated with saved Activity Configurations.

### Word

Stores:

- English word
- Optional hint
- Word List relationship
- Ordered phoneme records

### Phoneme

Stores an individual phoneme belonging to a Word.

The `position` field preserves the phoneme sequence.

For example:

```text
cheese
tʃ | iː | z
```

`tʃ` is stored as one phoneme unit.

### Activity

Stores reusable Wordle and Word Search configurations.

Activity data includes:

- Activity name
- Activity type
- Difficulty
- Instructions
- Hint
- Number of guesses
- Word Search dimensions
- Hint visibility
- Associated Word List

Supported activity types are:

```text
WORDLE
WORD_SEARCH
```

### ActivityWord

Provides the many-to-many relationship between Activities and Words.

### UsageEvent

Stores operational and usage information generated while the application is being used.

Supported event types include:

```text
PAGE_VIEW
ACTIVITY_CREATED
GENERATION_SUCCESS
GENERATION_FAILED
```

A UsageEvent can also store:

- Activity type
- Page
- Page duration
- Event message
- Creation timestamp

Indexes are used on event type, activity type and creation time to support reporting queries.

---

## API Design

The application provides REST-style Route Handlers for database operations.

### Words

```text
GET    /api/words
POST   /api/words
GET    /api/words/[id]
PUT    /api/words/[id]
DELETE /api/words/[id]
```

These endpoints provide CRUD operations for Words and their ordered Phoneme records.

### Word Lists

```text
GET    /api/word-lists
POST   /api/word-lists
GET    /api/word-lists/[id]
PUT    /api/word-lists/[id]
DELETE /api/word-lists/[id]
```

These endpoints provide CRUD operations for reusable Word Lists.

### Activities

```text
GET    /api/activities
POST   /api/activities
GET    /api/activities/[id]
PUT    /api/activities/[id]
DELETE /api/activities/[id]
```

These endpoints manage saved Wordle and Word Search Activity Configurations.

### Usage Events

```text
GET  /api/usage-events
POST /api/usage-events
```

The POST endpoint records operational events generated by the activity builders.

The GET endpoint returns recent recorded events.

### Dashboard

```text
GET /api/dashboard
```

The Dashboard API aggregates database and UsageEvent data into reporting metrics used by the `/dashboard` interface.

### Health Check

```text
GET /health
```

A successful request returns HTTP status `200`:

```json
{
  "status": "ok",
  "service": "phoneme-builder"
}
```

---

## Dashboard and Reporting

The dashboard provides a database-backed view of application activity and operational behaviour.

### Summary Metrics

The dashboard reports:

- Application health
- Total saved activities
- Generation success rate
- Average time on activity pages
- Most-used activity type

### Activity Performance

Wordle and Word Search are reported separately.

For each builder, the dashboard displays:

- Successful generations
- Failed generations
- Total generation attempts
- Generation success rate
- Average page duration

### Generation Activity

Generation attempts are grouped by date to show successful and failed generation activity over time.

### Difficulty Distribution

Saved Activity Configurations are grouped by:

- Easy
- Medium
- Hard

### Content Statistics

The dashboard reports stored application content including:

- Word Lists
- Words
- Phonemes
- Average words per list

### Operational Details

The dashboard also includes:

- Operational alerts
- Recent saved activities
- Recent Usage Events

This provides visibility into both application content and runtime behaviour.

---

## Observability

Operational monitoring was implemented using the `UsageEvent` database model.

The activity builders record events for important actions.

### Page Views

When a user spends time on the Wordle or Word Search builder, a `PAGE_VIEW` event records the page and duration.

### Generation Success

A valid generated activity records:

```text
GENERATION_SUCCESS
```

### Generation Failure

Invalid generation attempts record:

```text
GENERATION_FAILED
```

### Activity Creation

Creating a saved activity records:

```text
ACTIVITY_CREATED
```

These records are aggregated by `/api/dashboard` to provide operational reporting without hard-coded dashboard values.

---

## Validation and Error Handling

Server-side validation is performed before database operations.

Validation includes:

- Required activity names
- Supported activity types
- Valid difficulty values
- Valid positive integer IDs
- Existing Word List references
- Positive whole-number Wordle guess counts
- Positive Word Search row and column values
- Boolean `showHints` values
- Valid resource IDs

Missing resources return appropriate `404` responses.

Invalid input returns appropriate client error responses.

Unexpected server failures return `500` responses.

The activity builders also record failed generation attempts for reporting purposes.

---

# Testing

## Playwright End-to-End Testing

Playwright is used for automated end-to-end testing.

The final test suite contains three tests:

```text
builder-crud.spec.ts
wordle-user.spec.ts
dashboard-api.spec.ts
```

### Builder CRUD Test

The builder test verifies that a user can:

1. Open Manage Words
2. Create a Word List
3. Update the Word List
4. Delete the Word List

This tests the user interface, API and database persistence as one workflow.

### Wordle User Test

The Wordle test verifies a user workflow for generating and completing a Wordle activity.

This confirms that the activity builder and generated output work together.

### Dashboard API Test

The dashboard API test verifies that the reporting endpoint returns operational dashboard data.

### Final Result

```text
3 passed
```

The final Playwright suite completed successfully after the final UI refinements.

Run the tests with:

```bash
npx playwright test
```

---

## JMeter Load Testing

Apache JMeter was used to test the application under increasing levels of simulated concurrent traffic.

The load test includes two application workflows:

```text
Builder - Manage Words
Generated Activity - Wordle
```

The test was executed at multiple traffic levels.

| Simulated Users | Requests | Error Rate | Result |
|---:|---:|---:|---|
| 1 | 2 | 0.00% | Completed successfully |
| 10 | 20 | 0.00% | Completed successfully |
| 100 | 200 | 0.00% | Completed successfully |
| 1,000 | 2,000 | 62.20% | Capacity limits became visible |
| 10,000 | 20,000 | 90.28% | Extreme load exceeded local capacity |

At lower traffic levels the application completed requests without errors.

The 100-user test also completed all 200 requests with a 0% error rate, although response times increased significantly compared with the smaller tests.

At 1,000 simulated users, the final JMeter run recorded:

```text
Requests: 2000
Average response time: 23783 ms
Maximum response time: 107274 ms
Error rate: 62.20%
Throughput: 12.0 requests/second
```

At 10,000 simulated users, the final run recorded:

```text
Requests: 20000
Average response time: 9030 ms
Maximum response time: 127619 ms
Error rate: 90.28%
Throughput: 41.1 requests/second
```

The lower average response time at 10,000 users does not indicate better performance. A large number of requests failed quickly, which reduced the calculated average.

The results show that the application is reliable under the lower tested traffic levels but reaches the capacity of the local development environment under extreme concurrency.

The high-load results provide a clear scalability limit. A production deployment would require further optimisation, production infrastructure and an appropriate scaling strategy before supporting traffic at this level.

The JMeter test plan is stored at:

```text
jmeter/phoneme-builder-load-test.jmx
```

Recorded high-load result files are also stored in the `jmeter` directory.

---

## Lighthouse

Google Lighthouse was used to evaluate the dashboard.

### Desktop

```text
Performance:     91
Accessibility:   100
Best Practices:  100
SEO:             100
```

### Mobile

```text
Performance:     51
Accessibility:   100
Best Practices:  100
SEO:             92
```

Accessibility achieved a score of **100** in both tests.

The difference in performance between desktop and mobile indicates that performance optimisation could be investigated further, particularly for constrained mobile conditions.

The Lighthouse tests were performed against the locally running application, so the scores represent the tested development environment rather than a production deployment.

---

## Production Verification

The final production build was verified using:

```bash
npm run build
```

The final build completed successfully with:

```text
Compiled successfully
Finished TypeScript
Generating static pages (16/16)
```

The production build confirmed that the application pages, API routes and TypeScript code compiled successfully after the final Assessment 3 changes.

---

## Getting Started

### Requirements

Install:

- Node.js
- npm

Docker Desktop is required if the application is run using Docker.

### Install Dependencies

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

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

## Docker

The project includes a `Dockerfile` and `.dockerignore`.

The Docker image uses Node.js 22 and includes the system dependencies required by Prisma and `better-sqlite3`.

### Build Image

```bash
docker build -t phoneme-builder .
```

### Run Container

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

This allows SQLite data to persist independently of the container lifecycle.

### Container Commands

View running containers:

```bash
docker ps
```

Stop:

```bash
docker stop phoneme-builder-container
```

Start:

```bash
docker start phoneme-builder-container
```

Remove:

```bash
docker rm phoneme-builder-container
```

Removing the container does not automatically remove the named data volume.

---

## Project Structure

```text
phoneme-builder/
├── app/
│   ├── api/
│   │   ├── activities/
│   │   ├── dashboard/
│   │   ├── usage-events/
│   │   ├── word-lists/
│   │   └── words/
│   ├── about/
│   ├── dashboard/
│   ├── manage-words/
│   ├── settings/
│   ├── word-search/
│   └── wordle/
├── components/
├── jmeter/
│   ├── phoneme-builder-load-test.jmx
│   ├── 1000-users-results.jtl
│   └── 10000-users-results.jtl
├── lib/
│   └── prisma.ts
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
├── tests/
│   ├── builder-crud.spec.ts
│   ├── dashboard-api.spec.ts
│   └── wordle-user.spec.ts
├── Dockerfile
├── .dockerignore
├── package.json
├── playwright.config.ts
├── prisma.config.ts
└── README.md
```

---

## Git Workflow

Development was completed using feature branches and regular Git commits.

Assessment 3 work was developed on:

```text
feature/assessment3-dashboard
```

The development history separates major implementation stages including:

- Usage tracking
- Dashboard metrics
- Dashboard reporting
- Navigation
- Playwright testing
- JMeter load testing
- UI refinement

This provides a traceable development history rather than committing the entire implementation as a single change.

---

## Known Limitations

The load testing results show that the local development environment does not support extreme concurrent traffic without a significant failure rate.

The current project uses SQLite, which is appropriate for the scope of this application but would not be the preferred database for a high-concurrency production deployment.

Mobile Lighthouse performance was also lower than desktop performance during local testing.

These areas could be improved in a production version through application optimisation, production deployment configuration, caching, infrastructure scaling and a database designed for higher concurrent workloads.

---

## Submission Notes

Generated dependencies and build output should not be included in the source-code submission archive.

Exclude:

```text
node_modules/
.next/
playwright-report/
test-results/
```

Local environment and SQLite database files should also remain excluded from source control.

Dependencies can be restored with:

```bash
npm install
```

The project can then be rebuilt with:

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