# Elo

An earnings notebook for people who work for themselves.

You serve clients, you charge them and, at the end of the month, you don't
know how much came in. Elo records each appointment and shows the total on
the dashboard.

![Java](https://img.shields.io/badge/Java-17-10b981?style=flat-square&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1-10b981?style=flat-square&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-10b981?style=flat-square&logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-19-10b981?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-10b981?style=flat-square&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-10b981?style=flat-square)

## Who it's for

Hairdressers, manicurists, house cleaners, technicians, freelancers. Anyone
who charges per service and has no time for spreadsheets.

## What it does

- Records each appointment: name, date, amount charged, work done and source.
- Shows the month's revenue on the dashboard, compared to the previous month.
- Calculates the average ticket and shows where clients came from.
- Filters the dashboard by month or shows the full history.
- Exports appointments as CSV.
- Email and password login (JWT). Each user only sees their own data.

## Stack

| Layer | Technologies |
|--------|-------------|
| Back-end | Java 17, Spring Boot 4.1, Spring Security, Spring Data JPA, Bean Validation |
| Auth | JWT + BCrypt, stateless |
| Database | PostgreSQL |
| Front-end | React 19, TypeScript, Vite 6, Tailwind CSS 4, shadcn/ui, Recharts |
| Tests | JUnit 5, Mockito, MockMvc |

## Structure

```
.
├── Back-end/clientes/        # REST API (Spring Boot)
│   └── src/main/java/com/CRM/clientes/
│       ├── controllers/      # REST endpoints
│       ├── services/         # Business rules
│       ├── repository/       # Spring Data JPA
│       ├── domain/           # Entities
│       ├── dtos/             # Request / Response
│       └── infra/            # Security, CORS, error handling
└── Front-End/                # React SPA (see Front-End/README.md)
```

## How to run

### With Docker (fastest)

**Prerequisite:** Docker with Compose.

```bash
cp .env.example .env
# change DB_PASSWORD and TOKEN_SECRET in .env
docker compose up -d --build
```

| Service | Address |
|---------|----------|
| Front-end | http://localhost:3000 |
| API | http://localhost:8080 |
| Database | localhost:5433 |

To stop: `docker compose down` (data stays in the `elo_pgdata` volume;
`docker compose down -v` deletes everything).

### Without Docker

**Prerequisites:** Java 17, Node.js 20+ and PostgreSQL running on port 5432.

#### 1. Database

```sql
CREATE DATABASE crm_kauezao;
```

Hibernate creates the tables on the first startup. The reference schema is
in `Back-end/clientes/src/main/resources/db/schema_clientes.sql`.

#### 2. Back-end

Create the local config file with your Postgres username and password
(it stays out of git):

```bash
cd Back-end/clientes/src/main/resources
cp application-local.yml.example application-local.yml
# edit username and password
```

Start the API (or run `ClientesApplication` straight from the IDE):

```bash
cd Back-end/clientes
./mvnw spring-boot:run
```

The API starts at `http://localhost:8080`. Test it with `GET /api/health`.

#### 3. Front-end

```bash
cd Front-End
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:3000`. In dev, Vite forwards `/api` to port 8080.

### Tests

```bash
cd Back-end/clientes && ./mvnw test
cd Front-End && npm run lint && npm run build
```

## API

All routes except `/api/auth/registro`, `/api/auth/login` and
`/api/health` require `Authorization: Bearer <token>`.

| Method | Route | Description |
|--------|------|-----------|
| GET | `/api/health` | API status |
| POST | `/api/auth/registro` | Create an account |
| POST | `/api/auth/login` | Sign in (returns the token) |
| GET, PUT | `/api/auth/perfil` | View or update the profile |
| GET, POST | `/api/clientes` | List or create appointments |
| GET, PUT, DELETE | `/api/clientes/{id}` | View, edit or delete an appointment |
| GET, POST | `/api/origens` | List or create sources |
| DELETE | `/api/origens/{id}` | Delete a source |

Errors all follow the same format:

```json
{ "timestamp": "...", "status": 400, "mensagem": "...", "campos": { "email": "..." } }
```

`campos` says which input failed, so the front-end can highlight the right field.

## Production

`application.yml` reads environment variables, with defaults meant only for dev.
In production, set at least `DB_URL`, `DB_USER`, `DB_PASSWORD`,
`TOKEN_SECRET` (strong), `CORS_ORIGINS` with your domain and, after creating
your account, `REGISTRATION_ENABLED=false`. The full list is in
[`.env.example`](.env.example). `docker-compose.yml` starts the database, API and front-end;
each module also has its own `Dockerfile`.

## Next steps

Bills to pay with due-date reminders, notifications and email verification
by code.

## License

[MIT](LICENSE)
