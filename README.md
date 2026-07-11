# Devtiro Restaurant Review App

This is the backend and frontend source code for the Devtiro Restaurant Review App build published
March 2025.

The Restaurant Review Platform is a Spring Boot application for creating and reviewing restaurants,
with photo upload, geospatial search backed by Elasticsearch, and authentication handled by Keycloak.
The frontend is a Next.js application.

You can check out the build video [here](https://youtu.be/rki0eVGAVTQ).

## The Build Guide

The full step-by-step write-up of the build lives in
[docs/restaurant-review-app-combined.md](docs/restaurant-review-app-combined.md). It covers the
project brief, the domain design, and then builds the backend up endpoint by endpoint, including the
Keycloak setup, photo upload, and restaurant search.

## What's In This Repo

| Directory   | Contents                                                          |
| ----------- | ----------------------------------------------------------------- |
| `docs/`     | The build guide and its diagram                                     |
| `backend/`  | The Spring Boot backend, as built in the video                      |
| `frontend/` | The Next.js frontend, provided for you to interact with the backend |

## Running It

You'll need JDK 21, Node 20 or later, and Docker.

```bash
# Start Elasticsearch, Kibana and Keycloak, then run the backend
cd backend
docker compose up -d
./mvnw spring-boot:run

# Run the frontend, in a second terminal
cd frontend
npm install
npm run dev
```

The frontend runs on http://localhost:3000. The supporting services come up on these ports:

| Service       | URL                   |
| ------------- | --------------------- |
| Keycloak      | http://localhost:9090 |
| Elasticsearch | http://localhost:9200 |
| Kibana        | http://localhost:5601 |

Keycloak needs a `restaurant-review` realm to match the backend's configured issuer URI — the guide
walks through setting this up.

The frontend reads its configuration from `frontend/.env.local`, which is committed to this repo with
the local development values used in the build. It expects a Keycloak client called
`restaurant-review-app` in the `restaurant-review` realm. API calls go to the Next.js dev server,
which proxies `/api` through to the backend on port 8080.

> [!WARNING]
> This project is pinned to **Java 21** and **Spring Boot 3.4.2**. It was built and tested against
> those versions only. Newer versions of Spring Boot and Java may require changes to the code and
> configuration in this repo, and the guide's instructions may no longer match what you see.

> [!CAUTION]
> **This is intended for your local development environment only.** It is not production-ready. The
> Keycloak admin credentials in `docker-compose.yaml` are the default `admin`/`admin`, and
> Elasticsearch runs with security disabled.

> [!IMPORTANT]
> This is a teaching project. It's written to demonstrate how a Spring Boot application is designed
> and built, following the same practices I'd use on real work — a layered architecture, DTOs and
> mappers at the API boundary, constructor injection, and centralised error handling.
>
> That said, it was built live, and its scope is deliberately limited to what the build covers. It
> may contain bugs, and some things a production system would need — comprehensive input validation,
> a full test suite, hardened infrastructure config — are out of scope by design rather than by
> oversight.

## Licence

This repo is licensed in two parts.

**The code** — `backend/` and `frontend/` — is [MIT licensed](LICENSE). Use it, change it, build on
it, no strings attached.

**The build guide** — everything in [`docs/`](docs/LICENSE) — is licensed under
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). You're welcome to share it,
translate it, and build on it, but please credit Devtiro, don't sell it or put it behind a paywall,
and keep any adaptations under the same licence.

Copyright © 2025 Devtiro Ltd.
