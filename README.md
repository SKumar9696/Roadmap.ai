# Roadmap.ai

An AI-powered interview preparation app. Paste a job description, upload your resume (or write a short self-description), and get a personalised interview plan in about 30 seconds:

- a **match score** showing how well your profile fits the role
- **technical and behavioral questions** you're likely to be asked, each with why the interviewer asks it and how to answer
- **skill gaps** ranked by priority
- a **day-by-day preparation road map**

Every plan is saved to your account, so you can come back to it later.

## Features

- **Resume parsing:** upload a PDF (up to 3 MB) and its text is extracted on the server
- **Resume or self-description:** either one is enough to generate a plan
- **Structured AI output:** Google Gemini returns JSON that matches a Zod schema, so every plan has the same shape
- **Interview plan page:**
  - expandable question cards
  - a timeline view of the road map
  - a match-score ring
  - skill gaps colour-coded by priority
- **Plan history:** your recent plans are listed on the home page
- **Accounts:** register, log in and log out, using JWT stored in an HTTP cookie, bcrypt-hashed passwords and a token blacklist on logout
- **Clear errors:** wrong passwords, missing fields and oversized files show a message instead of failing silently
- **Responsive UI:** works on desktop, tablet and phone

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 7, React Router 7, Sass, Axios |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| AI | Google Gemini via `@google/genai`, with Zod + `zod-to-json-schema` for structured output |
| Auth | JSON Web Tokens, bcryptjs, cookie-parser |
| File handling | Multer (in-memory uploads), pdf-parse |

## How it works

```
Browser (React)                    Express API                         External
───────────────                    ───────────                         ────────
Home page form  ── multipart ──▶  POST /api/interview
 (job description,                  │ 1. check JWT cookie
  resume PDF and/or                 │ 2. extract resume text (pdf-parse)
  self-description)                 │ 3. send prompt + JSON schema  ──▶  Google Gemini
                                    │ 4. receive structured report  ◀──
                                    │ 5. save report               ──▶  MongoDB
Interview plan page ◀── JSON ──     └─ return the saved report
```

## Project structure

```
.
├── Backend/
│   ├── server.js                  # starts the server and connects to MongoDB
│   └── src/
│       ├── app.js                 # Express app, CORS, routes
│       ├── config/database.js
│       ├── controllers/           # auth + interview request handlers
│       ├── middlewares/           # JWT auth check, file upload (multer)
│       ├── models/                # User, InterviewReport, token blacklist
│       ├── routes/
│       └── services/ai.service.js # Gemini prompt + response schema
└── Frontend/
    └── src/
        ├── components/            # AppBar, LoadingScreen, Sparkle icon
        ├── config.js              # app name
        ├── style/                 # theme tokens (_theme.scss), buttons
        └── features/
            ├── auth/              # login, register, auth context + hook
            └── interview/         # home, interview plan page, API calls
```

## Getting started

### Prerequisites

- **Node.js 22 LTS** (minimum 20.19; Node 21 is not supported by pdf-parse)
- A **MongoDB** database. A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works, or a local MongoDB server.
- A **Google Gemini API key** from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```

### 2. Set up the backend

```bash
cd Backend
npm install
```

Copy `.env.example` to `.env` and fill in your values:

```env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/interview-ai
JWT_SECRET=a-long-random-string
GOOGLE_GENAI_API_KEY=your-gemini-api-key
```

Start the server:

```bash
npm run dev
```

You should see `Server is running on port 3000` and `Connected to Database`.

### 3. Set up the frontend

In a second terminal:

```bash
cd Frontend
npm install
npm run dev
```

Open **http://localhost:5173**.

> The backend only accepts requests from `http://localhost:5173` (set in `Backend/src/app.js`). If Vite picks another port because 5173 is busy, free that port first.

## Environment variables

| Variable | Description |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign login tokens. Use any long random string. |
| `GOOGLE_GENAI_API_KEY` | Google Gemini API key |

## API reference

All interview routes require the `token` cookie that is set on login or register.

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Create an account (`username`, `email`, `password`) |
| `POST` | `/api/auth/login` | Log in (`email`, `password`) |
| `GET` | `/api/auth/logout` | Log out and blacklist the current token |
| `GET` | `/api/auth/get-me` | Get the logged-in user |
| `POST` | `/api/interview/` | Generate a plan. Multipart form: `jobDescription` (required), `resume` (PDF, optional), `selfDescription` (optional). At least one of resume or self-description is required. |
| `GET` | `/api/interview/` | List your plans, newest first |
| `GET` | `/api/interview/report/:interviewId` | Get one of your plans |

## Known limitations

- Only PDF resumes are supported, up to 3 MB. Scanned or image-only PDFs have no extractable text.
- The API URL (`http://localhost:3000`) and CORS origin are hardcoded for local development, so they need to move to environment variables before deploying.
- The Gemini model name is set in `Backend/src/services/ai.service.js`. If Google retires it, change it to a current model.

## Roadmap

- [ ] Mock interview mode: answer a question and get AI feedback
- [ ] Track progress on road-map tasks
- [ ] DOCX resume support
- [ ] Deployment configuration (environment-based API URL, secure cookies)

## Acknowledgements

This project started from a tutorial by **[TUTORIAL CREATOR](LINK-TO-VIDEO)** and was then extended. My changes include:

- a redesigned UI
- self-description-only support
- error handling throughout
- logout
- responsive layouts
- removing the resume-PDF generator
