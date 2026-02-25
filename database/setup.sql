-- setup.sql
-- Description: Main setup script to create database and run all migrations
-- Usage: psql -U postgres -f setup.sql

-- Create database (run this as postgres superuser)
-- Uncomment the line below if you need to create the database
-- CREATE DATABASE rara_platform;

-- Connect to the database
\c rara_platform;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Run all migrations in order
\i migrations/001_create_users_table.sql
\i migrations/002_create_tutors_table.sql
\i migrations/003_create_parents_table.sql
\i migrations/004_create_students_table.sql
\i migrations/005_create_sites_table.sql
\i migrations/006_create_services_table.sql
\i migrations/007_create_partners_table.sql
\i migrations/008_create_topic_tags_table.sql
\i migrations/009_create_sessions_table.sql
\i migrations/010_create_session_students_table.sql
\i migrations/011_create_session_topics_table.sql
\i migrations/012_create_student_parents_table.sql
\i migrations/013_create_student_tutor_assignments_table.sql
\i migrations/014_create_site_service_table.sql
\i migrations/015_create_partnerships_table.sql
\i migrations/016_create_availability_table.sql
\i migrations/017_create_assessments_table.sql
\i migrations/018_create_progress_metrics_table.sql
\i migrations/019_create_weekly_goals_table.sql
\i migrations/020_create_action_items_table.sql
\i migrations/021_create_recommendations_table.sql
\i migrations/022_create_audit_logs_table.sql
\i migrations/023_create_notifications_table.sql
\i migrations/024_add_oauth_support.sql
\i migrations/025_create_curriculum_grades_table.sql
\i migrations/026_create_curriculum_domains_table.sql
\i migrations/027_create_curriculum_clusters_table.sql
\i migrations/028_create_curriculum_skills_table.sql
\i migrations/029_seed_math_ela_sel_curriculum.sql
\i migrations/030_add_taxonomy_links_to_sessions.sql

-- Verify tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
