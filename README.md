# url-shortener

A performance-oriented URL shortening service built on **Node.js 24** and **Fastify**. When traffic spikes, the service stays fast by keeping analytics off the critical path — events are emitted and handled asynchronously within the same process — while Redis handles the fast lookups.

---

## Prerequisites

- [Docker](https://www.docker.com/) & Docker Compose
- [pnpm](https://pnpm.io/) (recommended)
- PostgreSQL & Redis

---

## Getting Started

**Step 1.** Copy the config file and fill in your credentials:

```bash
cp .env.example .env
```

**Step 2.** Run via Docker (easiest):

```bash
docker compose up --build
```

Or locally, without containers:

```bash
pnpm install
pnpm migrations
pnpm develop
```

---

## API Endpoints

Routing is split into two separate groups — public redirects and analytics.

| Method | Path                         | Description                                     |
| ------ | ---------------------------- | ----------------------------------------------- |
| `GET`  | `/api/healthz`               | Health check                                    |
| `POST` | `/api/urls`                  | Create a short URL (`originalUrl`, `expiresAt`) |
| `GET`  | `/urls/:shortCode`           | Resolve and redirect (302)                      |
| `GET`  | `/api/urls/:shortCode/stats` | Click statistics and metadata                   |

---

## Architecture — Why These Decisions?

A few design choices involved conscious trade-offs. Here's the reasoning behind each.

### Rich Domain Model

The `Url` entity isn't just a data bag. It protects its own invariants — protocol validation, length constraints — through a private constructor and static factory methods. Errors are caught as early as possible, before data travels any deeper into the system.

### Decorator Instead of Mixing Concerns

Rather than sprinkling caching logic throughout the business layer, `CachedUrlService` wraps `UrlService` as a decorator. The core service stays clean and easy to test, while all Redis concerns are isolated in one place. Swapping out the cache later means touching exactly one file.

### Non-Blocking Redirects

The redirect is the hot path — it has to be fast. Rather than waiting for the database, `UrlEventPublisher` emits a `url-analytic` event on a shared `EventEmitter` and the service immediately returns the `302`. On the other side, `AnalyticsService` listens for that event in the same process and handles persistence entirely out of the user's way.

### Batched Database Writes

`AnalyticsService` buffers events in memory and flushes them to PostgreSQL in batches of 100 records per `INSERT`. Instead of hammering the database with individual writes on every click, you get one query per hundred events — which keeps I/O pressure manageable even during traffic spikes.

### Raw Ingress & No Foreign Key

The analytics event is emitted _before_ validation, and the analytics table has no foreign key back to the URLs table. This is an intentional choice — we want to log attempts to access non-existent or expired links too. That data is invaluable for detecting bots and security scanning.

### Manual DI in `container.ts`

The entire object graph is wired up by hand in one place. No magic, no heavy DI frameworks. Every dependency is immediately visible, and mocking in tests is trivial.

### Type Safety End-to-End

[Kysely](https://kysely.dev/) provides full TypeScript-level typing for SQL queries. [Zod](https://zod.dev/) handles runtime data integrity.

---

## Tests

The project mixes unit tests for domain logic with integration tests for the repository layer.

```bash
pnpm test
```
