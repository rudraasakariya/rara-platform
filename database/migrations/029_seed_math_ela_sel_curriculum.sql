-- Migration: 029_seed_math_ela_sel_curriculum.sql
-- Description: Seed Math, ELA, and SEL services and minimal curriculum taxonomy (grades, domains, clusters, skills).
-- Source: Placeholder structure for Phase 1. Can be replaced or extended with a standards framework (e.g. Achieve the Core) later.

-- 1. Ensure Service records exist for Math, ELA, SEL
INSERT INTO services (name, description, active)
VALUES
    ('Math', 'Mathematics', true),
    ('ELA', 'English Language Arts', true),
    ('SEL', 'Social-Emotional Learning', true)
ON CONFLICT (name) DO NOTHING;

-- 2. Seed one placeholder grade per service (Grade 1)
INSERT INTO curriculum_grades (service_id, code, label, description)
SELECT id, '1', 'Grade 1', 'Grade 1 placeholder'
FROM services
WHERE name IN ('Math', 'ELA', 'SEL')
ON CONFLICT (service_id, code) DO NOTHING;

-- 3. Seed one placeholder domain per grade
INSERT INTO curriculum_domains (grade_id, code, label, description)
SELECT g.id, 'D1', 'Domain 1', 'Placeholder domain'
FROM curriculum_grades g
JOIN services s ON g.service_id = s.id
WHERE s.name IN ('Math', 'ELA', 'SEL') AND g.code = '1'
ON CONFLICT (grade_id, code) DO NOTHING;

-- 4. Seed one placeholder cluster per domain
INSERT INTO curriculum_clusters (domain_id, code, label, description)
SELECT d.id, 'C1', 'Cluster 1', 'Placeholder cluster'
FROM curriculum_domains d
JOIN curriculum_grades g ON d.grade_id = g.id
JOIN services s ON g.service_id = s.id
WHERE s.name IN ('Math', 'ELA', 'SEL') AND g.code = '1' AND d.code = 'D1'
ON CONFLICT (domain_id, code) DO NOTHING;

-- 5. Seed one placeholder skill per cluster
INSERT INTO curriculum_skills (cluster_id, code, label, description)
SELECT c.id, 'S1', 'Skill 1', 'Placeholder skill'
FROM curriculum_clusters c
JOIN curriculum_domains d ON c.domain_id = d.id
JOIN curriculum_grades g ON d.grade_id = g.id
JOIN services s ON g.service_id = s.id
WHERE s.name IN ('Math', 'ELA', 'SEL') AND g.code = '1' AND d.code = 'D1' AND c.code = 'C1'
ON CONFLICT (cluster_id, code) DO NOTHING;
