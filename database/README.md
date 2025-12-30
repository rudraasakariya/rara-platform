# RARA Platform Database

This directory will contain all database migrations and setup files.

## Structure

```
database/
├── migrations/          # All migration files (will be added in chronological order)
└── README.md           # This file
```

## Database Schema Overview

The RARA Platform database will include the following tables (to be added via migrations):

- users
- tutors
- parents
- students
- sites
- services
- partners
- topic_tags
- sessions
- session_students
- session_topics
- student_parents
- student_tutor_assignments
- site_service
- partnerships
- availability
- assessments
- progress_metrics
- weekly_goals
- action_items
- recommendations
- audit_logs
- notifications

## Prerequisites

1. **PostgreSQL installed** (version 12+)
   - macOS: `brew install postgresql@14`
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:14`

2. **PostgreSQL running**
   - macOS: `brew services start postgresql@14`
   - Or start Docker container: `docker start postgres`

## Setup Instructions

### Create the database:

```bash
psql -U postgres
CREATE DATABASE rara_platform;
\q
```

### Run migrations:

Migrations will be added in chronological order through feature branches and PRs.

## Connection String

Once set up, your connection string will be:
```
postgresql://username:password@localhost:5432/rara_platform
```

For local development (default postgres user):
```
postgresql://postgres:postgres@localhost:5432/rara_platform
```

## Next Steps

Database migrations will be added systematically through GitHub issues and PRs, starting with the "Database Setup" feature.

