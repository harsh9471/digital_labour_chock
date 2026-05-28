-- ============================================================
-- DIGITAL LABOUR CHOWK
-- PostgreSQL Seed Data
-- Version  : 1.0.0
-- Run AFTER schema.sql
-- ============================================================
-- Records:
--   Locations   : 10  (major Indian cities)
--   Skills      : 18  (across 6 categories)
--   Roles       : 4   (system roles)
--   Permissions : 12
--   Admins      : 2
--   Companies   : 3
--   Contractors : 5
--   Workers     : 20  (with skills)
--   Company Admins: 3
-- ============================================================

\set ON_ERROR_STOP on
SET timezone = 'Asia/Kolkata';

BEGIN;

-- ============================================================
-- LOCATIONS (10 major Indian cities)
-- ============================================================
INSERT INTO locations (id, city, district, state, country, pincode, latitude, longitude) VALUES
  ('loc_mumbai_01',   'Mumbai',    'Mumbai City',   'Maharashtra',  'India', '400001',  19.07600, 72.87770),
  ('loc_delhi_01',    'Delhi',     'New Delhi',     'Delhi',        'India', '110001',  28.61390, 77.20900),
  ('loc_bengaluru_01','Bangalore', 'Bengaluru Urban','Karnataka',   'India', '560001',  12.97160, 77.59460),
  ('loc_chennai_01',  'Chennai',   'Chennai',       'Tamil Nadu',   'India', '600001',  13.08270, 80.27070),
  ('loc_hyderabad_01','Hyderabad', 'Hyderabad',     'Telangana',    'India', '500001',  17.38500, 78.48670),
  ('loc_pune_01',     'Pune',      'Pune',          'Maharashtra',  'India', '411001',  18.52040, 73.85670),
  ('loc_ahmedabad_01','Ahmedabad', 'Ahmedabad',     'Gujarat',      'India', '380001',  23.02250, 72.57140),
  ('loc_kolkata_01',  'Kolkata',   'Kolkata',       'West Bengal',  'India', '700001',  22.57260, 88.36390),
  ('loc_jaipur_01',   'Jaipur',    'Jaipur',        'Rajasthan',    'India', '302001',  26.91240, 75.78730),
  ('loc_surat_01',    'Surat',     'Surat',         'Gujarat',      'India', '395001',  21.17020, 72.83110)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SKILLS (18 skills across 6 categories)
-- ============================================================
INSERT INTO skills (id, name, slug, category, description, icon, is_active) VALUES
  -- Construction
  ('skl_masonry',       'Masonry',           'masonry',           'Construction',  'Brick and stone laying, plastering',           '🧱', TRUE),
  ('skl_carpentry',     'Carpentry',         'carpentry',         'Construction',  'Wood work, doors, windows, furniture',         '🪚', TRUE),
  ('skl_plumbing',      'Plumbing',          'plumbing',          'Construction',  'Pipe fitting, sanitation, water supply',       '🔧', TRUE),
  ('skl_electrical',    'Electrical Work',   'electrical-work',   'Construction',  'Wiring, installations, repairs',               '⚡', TRUE),
  ('skl_painting',      'Painting',          'painting',          'Construction',  'Interior and exterior painting',               '🎨', TRUE),
  ('skl_welding',       'Welding',           'welding',           'Construction',  'Metal welding, fabrication, cutting',          '🔥', TRUE),
  ('skl_tiling',        'Tile Work',         'tile-work',         'Construction',  'Floor and wall ceramic/vitrified tiling',      '🏠', TRUE),
  -- Manufacturing
  ('skl_machine_op',    'Machine Operation', 'machine-operation', 'Manufacturing', 'Operating industrial machines and equipment',  '⚙️', TRUE),
  ('skl_qc',            'Quality Control',   'quality-control',   'Manufacturing', 'QC inspection, testing, documentation',        '✅', TRUE),
  -- Domestic
  ('skl_cooking',       'Cooking',           'cooking',           'Domestic',      'Food preparation, meal cooking',               '👨‍🍳', TRUE),
  ('skl_housekeeping',  'Housekeeping',      'housekeeping',      'Domestic',      'Cleaning, dusting, floor mopping',             '🧹', TRUE),
  ('skl_gardening',     'Gardening',         'gardening',         'Domestic',      'Garden maintenance, landscaping',              '🌿', TRUE),
  -- Transport
  ('skl_driving',       'Driving',           'driving',           'Transport',     'Vehicle driving (LMV/HMV)',                    '🚗', TRUE),
  ('skl_loading',       'Loading/Unloading', 'loading-unloading', 'Transport',     'Goods loading, unloading, stacking',           '📦', TRUE),
  -- Technology
  ('skl_pc_repair',     'Computer Repair',   'computer-repair',   'Technology',    'Hardware and software troubleshooting',        '💻', TRUE),
  ('skl_mob_repair',    'Mobile Repair',     'mobile-repair',     'Technology',    'Smartphone hardware and software repair',      '📱', TRUE),
  -- Agriculture
  ('skl_farming',       'Farming',           'farming',           'Agriculture',   'Crop cultivation, ploughing, irrigation',      '🌾', TRUE),
  ('skl_harvesting',    'Harvesting',        'harvesting',        'Agriculture',   'Crop harvesting, threshing',                   '🌻', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ROLES (4 system roles)
-- ============================================================
INSERT INTO roles (id, name, display_name, description, is_system) VALUES
  ('rol_super_admin',   'super_admin',   'Super Administrator', 'Full unrestricted platform access',               TRUE),
  ('rol_worker',        'worker',        'Worker',              'Daily wage worker profile access',                TRUE),
  ('rol_contractor',    'contractor',    'Contractor',          'Contractor profile and worker search access',     TRUE),
  ('rol_company_admin', 'company_admin', 'Company Admin',       'Company profile and workforce management access', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PERMISSIONS (12)
-- ============================================================
INSERT INTO permissions (id, name, resource, action, description) VALUES
  ('prm_users_read',        'users:read',        'users',        'read',   'View user profiles'),
  ('prm_users_write',       'users:write',       'users',        'write',  'Create and update users'),
  ('prm_users_delete',      'users:delete',      'users',        'delete', 'Soft-delete users'),
  ('prm_workers_read',      'workers:read',      'workers',      'read',   'View worker profiles'),
  ('prm_workers_write',     'workers:write',     'workers',      'write',  'Create and update worker profiles'),
  ('prm_contractors_read',  'contractors:read',  'contractors',  'read',   'View contractor profiles'),
  ('prm_contractors_write', 'contractors:write', 'contractors',  'write',  'Create and update contractor profiles'),
  ('prm_companies_read',    'companies:read',    'companies',    'read',   'View company data'),
  ('prm_companies_write',   'companies:write',   'companies',    'write',  'Create and update companies'),
  ('prm_docs_verify',       'documents:verify',  'documents',    'verify', 'Approve or reject documents'),
  ('prm_analytics_read',    'analytics:read',    'analytics',    'read',   'View platform analytics'),
  ('prm_settings_write',    'settings:write',    'settings',     'write',  'Modify platform settings')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- ROLE ↔ PERMISSION ASSIGNMENTS
-- ============================================================
-- Super Admin gets ALL permissions
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT
  'rp_' || r.id || '_' || p.id,
  r.id,
  p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'super_admin'
ON CONFLICT DO NOTHING;

-- Worker: own profile read/write
INSERT INTO role_permissions (id, role_id, permission_id) VALUES
  ('rp_wkr_r',   'rol_worker', 'prm_workers_read'),
  ('rp_wkr_w',   'rol_worker', 'prm_workers_write')
ON CONFLICT DO NOTHING;

-- Contractor: own profile + worker search
INSERT INTO role_permissions (id, role_id, permission_id) VALUES
  ('rp_con_cr',  'rol_contractor', 'prm_contractors_read'),
  ('rp_con_cw',  'rol_contractor', 'prm_contractors_write'),
  ('rp_con_wr',  'rol_contractor', 'prm_workers_read')
ON CONFLICT DO NOTHING;

-- Company Admin: company + contractor + worker read
INSERT INTO role_permissions (id, role_id, permission_id) VALUES
  ('rp_ca_cor',  'rol_company_admin', 'prm_companies_read'),
  ('rp_ca_cow',  'rol_company_admin', 'prm_companies_write'),
  ('rp_ca_cr',   'rol_company_admin', 'prm_contractors_read'),
  ('rp_ca_wr',   'rol_company_admin', 'prm_workers_read')
ON CONFLICT DO NOTHING;

-- ============================================================
-- ADMIN USERS (2)
-- Password: Password@123 → bcrypt hash (cost 12)
-- ============================================================
INSERT INTO users (id, email, phone, password_hash, first_name, last_name, role, status, email_verified, phone_verified) VALUES
  ('usr_admin_01',
   'superadmin@digitallabourchowk.com',
   '+919900000001',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K',
   'Rajesh', 'Kumar',
   'SUPER_ADMIN', 'ACTIVE', TRUE, TRUE),
  ('usr_admin_02',
   'admin@digitallabourchowk.com',
   '+919900000002',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K',
   'Priya', 'Sharma',
   'SUPER_ADMIN', 'ACTIVE', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO admins (id, user_id, is_super_admin, department) VALUES
  ('adm_01', 'usr_admin_01', TRUE,  'Management'),
  ('adm_02', 'usr_admin_02', FALSE, 'Operations')
ON CONFLICT (id) DO NOTHING;

-- Admin 1 gets all permissions
INSERT INTO admin_permissions (id, admin_id, permission_id)
SELECT 'ap_adm01_' || p.id, 'adm_01', p.id
FROM permissions p
ON CONFLICT DO NOTHING;

-- ============================================================
-- COMPANIES (3)
-- ============================================================
INSERT INTO users (id, email, phone, password_hash, first_name, last_name, role, status, email_verified, phone_verified) VALUES
  ('usr_ca_01', 'amit.mehta@buildright.co.in',     '+919800001001', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Amit',  'Mehta',   'COMPANY_ADMIN', 'ACTIVE', TRUE, TRUE),
  ('usr_ca_02', 'rekha.iyer@techbuild.in',          '+919800002002', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Rekha', 'Iyer',    'COMPANY_ADMIN', 'ACTIVE', TRUE, TRUE),
  ('usr_ca_03', 'vinod.chauhan@skilledhands.in',    '+919800003003', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Vinod', 'Chauhan', 'COMPANY_ADMIN', 'ACTIVE', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO companies (id, name, slug, registration_no, gst_number, pan_number, email, phone, website, description, is_verified, verified_at, employee_count, established_year, location_id) VALUES
  ('cmp_01',
   'BuildRight Construction Pvt Ltd',
   'buildright-construction',
   'CIN-U45200MH2015PTC123456',
   '27AAACB1234A1Z5',
   'AAACB1234A',
   'info@buildright.co.in', '+912267890000', 'https://buildright.co.in',
   'Leading construction company specializing in residential and commercial projects across Maharashtra',
   TRUE, '2024-01-15 09:00:00+05:30', 250, 2015, 'loc_mumbai_01'),
  ('cmp_02',
   'TechBuild Infrastructure Ltd',
   'techbuild-infrastructure',
   'CIN-U45200DL2018PTC987654',
   '07AAACT9876B1Z3',
   'AAACT9876B',
   'contact@techbuild.in', '+911123456789', 'https://techbuild.in',
   'Smart infrastructure and technology-driven construction solutions for smart cities',
   TRUE, '2024-02-20 10:00:00+05:30', 180, 2018, 'loc_delhi_01'),
  ('cmp_03',
   'SkilledHands Staffing Solutions',
   'skilledhands-staffing',
   'CIN-U74900KA2020PTC456789',
   '29AAACS4567C1Z1',
   'AAACS4567C',
   'hr@skilledhands.in', '+918023456789', 'https://skilledhands.in',
   'Premium labour staffing and workforce management solutions across India',
   TRUE, '2024-03-10 11:00:00+05:30', 500, 2020, 'loc_bengaluru_01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO company_admins (id, user_id, company_id, is_primary) VALUES
  ('ca_01', 'usr_ca_01', 'cmp_01', TRUE),
  ('ca_02', 'usr_ca_02', 'cmp_02', TRUE),
  ('ca_03', 'usr_ca_03', 'cmp_03', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- CONTRACTOR USERS (5)
-- ============================================================
INSERT INTO users (id, email, phone, password_hash, first_name, last_name, role, status, email_verified, phone_verified) VALUES
  ('usr_con_01', 'suresh.patil@contractor.com',   '+919811001001', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Suresh',    'Patil',  'CONTRACTOR', 'ACTIVE', TRUE, TRUE),
  ('usr_con_02', 'anita.desai@contractor.com',    '+919811002002', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Anita',     'Desai',  'CONTRACTOR', 'ACTIVE', TRUE, TRUE),
  ('usr_con_03', 'mo.khan@contractor.com',         '+919811003003', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Mohammed',  'Khan',   'CONTRACTOR', 'ACTIVE', TRUE, TRUE),
  ('usr_con_04', 'sunita.reddy@contractor.com',   '+919811004004', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Sunita',    'Reddy',  'CONTRACTOR', 'ACTIVE', TRUE, TRUE),
  ('usr_con_05', 'vikram.singh@contractor.com',   '+919811005005', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Vikram',    'Singh',  'CONTRACTOR', 'ACTIVE', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO contractors (id, user_id, company_id, specializations, license_number, license_expiry, rating, total_ratings, total_projects_done, location_id, is_verified, verified_at) VALUES
  ('con_01', 'usr_con_01', 'cmp_01', ARRAY['Civil Construction','RCC Work'],         'MH-CONT-2019-001', '2027-12-31', 4.8, 38, 45, 'loc_mumbai_01',    TRUE, NOW()),
  ('con_02', 'usr_con_02', 'cmp_02', ARRAY['Interior Design','Renovation'],          'DL-CONT-2020-002', '2026-06-30', 4.6, 27, 32, 'loc_delhi_01',     TRUE, NOW()),
  ('con_03', 'usr_con_03', 'cmp_01', ARRAY['Electrical','Solar Installation'],       'KA-CONT-2018-003', '2028-03-31', 4.9, 60, 67, 'loc_bengaluru_01', TRUE, NOW()),
  ('con_04', 'usr_con_04', 'cmp_03', ARRAY['Plumbing','Sanitation'],                 'TN-CONT-2021-004', '2025-09-30', 4.5, 22, 28, 'loc_chennai_01',   TRUE, NOW()),
  ('con_05', 'usr_con_05', 'cmp_02', ARRAY['HVAC','Mechanical Work'],                'TS-CONT-2022-005', '2026-12-31', 4.7, 15, 19, 'loc_hyderabad_01', TRUE, NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- WORKER USERS (20)
-- ============================================================
INSERT INTO users (id, phone, password_hash, first_name, last_name, role, status, phone_verified) VALUES
  ('usr_wkr_01', '+919700001001', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Ramesh',   'Yadav',   'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_02', '+919700001002', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Kavitha',  'Nair',    'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_03', '+919700001003', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Arun',     'Kumar',   'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_04', '+919700001004', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Lakshmi',  'Devi',    'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_05', '+919700001005', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Santosh',  'Gupta',   'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_06', '+919700001006', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Meena',    'Patel',   'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_07', '+919700001007', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Dinesh',   'Rawat',   'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_08', '+919700001008', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Pooja',    'Mishra',  'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_09', '+919700001009', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Rajendra', 'Thakur',  'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_10', '+919700001010', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Suman',    'Bai',     'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_11', '+919700001011', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Manoj',    'Tiwari',  'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_12', '+919700001012', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Geeta',    'Sharma',  'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_13', '+919700001013', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Prakash',  'Verma',   'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_14', '+919700001014', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Ritu',     'Soni',    'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_15', '+919700001015', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Harish',   'Chandra', 'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_16', '+919700001016', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Ananya',   'Joshi',   'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_17', '+919700001017', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Deepak',   'Pandey',  'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_18', '+919700001018', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Nirmala',  'Singh',   'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_19', '+919700001019', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Bharat',   'Lal',     'WORKER', 'ACTIVE', TRUE),
  ('usr_wkr_20', '+919700001020', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewWe1RKzSVHjzP9K', 'Sarla',    'Devi',    'WORKER', 'ACTIVE', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- WORKER PROFILES (20)
-- Columns: id, user_id, gender, languages, available_for_work,
--          hourly_rate, daily_rate, weekly_rate, experience_years,
--          location_id, rating, total_ratings, total_jobs_done,
--          is_profile_complete
-- ============================================================
INSERT INTO workers (id, user_id, gender, languages, available_for_work, hourly_rate, daily_rate, weekly_rate, experience_years, location_id, rating, total_ratings, total_jobs_done, is_profile_complete) VALUES
  ('wkr_01', 'usr_wkr_01', 'MALE',   ARRAY['Hindi','Marathi'],  TRUE,  120.00,  800.00,  4500.00,  8,  'loc_mumbai_01',    4.50, 120, 156, TRUE),
  ('wkr_02', 'usr_wkr_02', 'FEMALE', ARRAY['Malayalam','Hindi'],TRUE,   80.00,  550.00,  3200.00,  5,  'loc_chennai_01',   4.80, 175, 203, TRUE),
  ('wkr_03', 'usr_wkr_03', 'MALE',   ARRAY['Kannada','English'],FALSE, 150.00, 1000.00,  6000.00, 10,  'loc_bengaluru_01', 4.90, 290, 312, TRUE),
  ('wkr_04', 'usr_wkr_04', 'FEMALE', ARRAY['Telugu','Hindi'],   TRUE,   70.00,  480.00,  2800.00,  3,  'loc_hyderabad_01', 4.30,  78,  89, FALSE),
  ('wkr_05', 'usr_wkr_05', 'MALE',   ARRAY['Hindi','Punjabi'],  TRUE,  130.00,  900.00,  5500.00, 12,  'loc_delhi_01',     4.70, 410, 445, TRUE),
  ('wkr_06', 'usr_wkr_06', 'FEMALE', ARRAY['Gujarati','Hindi'], TRUE,   75.00,  520.00,  3000.00,  6,  'loc_pune_01',      4.60, 155, 178, TRUE),
  ('wkr_07', 'usr_wkr_07', 'MALE',   ARRAY['Hindi','Rajasthani'],TRUE, 200.00, 1400.00,  8500.00, 15,  'loc_jaipur_01',    4.80, 490, 523, TRUE),
  ('wkr_08', 'usr_wkr_08', 'FEMALE', ARRAY['Hindi','Bengali'],  FALSE,  85.00,  580.00,  3400.00,  4,  'loc_kolkata_01',   4.40, 120, 134, FALSE),
  ('wkr_09', 'usr_wkr_09', 'MALE',   ARRAY['Marathi','Hindi'],  TRUE,  140.00,  960.00,  5800.00,  9,  'loc_mumbai_01',    4.70, 240, 267, TRUE),
  ('wkr_10', 'usr_wkr_10', 'FEMALE', ARRAY['Gujarati','Hindi'], TRUE,   78.00,  540.00,  3100.00,  7,  'loc_ahmedabad_01', 4.50, 192, 211, TRUE),
  ('wkr_11', 'usr_wkr_11', 'MALE',   ARRAY['Hindi','Bhojpuri'], TRUE,  110.00,  750.00,  4500.00, 11,  'loc_delhi_01',     4.60, 360, 389, TRUE),
  ('wkr_12', 'usr_wkr_12', 'FEMALE', ARRAY['Telugu','Tamil'],   TRUE,   90.00,  620.00,  3700.00,  8,  'loc_chennai_01',   4.90, 425, 456, TRUE),
  ('wkr_13', 'usr_wkr_13', 'MALE',   ARRAY['Kannada','English'],FALSE, 160.00, 1100.00,  6500.00,  6,  'loc_bengaluru_01', 4.50, 178, 192, TRUE),
  ('wkr_14', 'usr_wkr_14', 'FEMALE', ARRAY['Gujarati','Hindi'], TRUE,   95.00,  650.00,  3900.00,  4,  'loc_surat_01',     4.30,  62,  67, FALSE),
  ('wkr_15', 'usr_wkr_15', 'MALE',   ARRAY['Marathi','Hindi'],  TRUE,  145.00,  980.00,  5900.00, 20,  'loc_pune_01',      4.80, 760, 789, TRUE),
  ('wkr_16', 'usr_wkr_16', 'FEMALE', ARRAY['Punjabi','Hindi'],  TRUE,   65.00,  450.00,  2700.00,  2,  'loc_delhi_01',     4.20,  30,  34, FALSE),
  ('wkr_17', 'usr_wkr_17', 'MALE',   ARRAY['Hindi','Bengali'],  TRUE,  175.00, 1200.00,  7200.00, 13,  'loc_kolkata_01',   4.70, 324, 348, TRUE),
  ('wkr_18', 'usr_wkr_18', 'FEMALE', ARRAY['Hindi','Awadhi'],   FALSE,  60.00,  400.00,  2400.00, 16,  'loc_mumbai_01',    4.60, 490, 512, TRUE),
  ('wkr_19', 'usr_wkr_19', 'MALE',   ARRAY['Gujarati','Hindi'], TRUE,  120.00,  820.00,  4900.00,  7,  'loc_ahmedabad_01', 4.40, 210, 223, TRUE),
  ('wkr_20', 'usr_wkr_20', 'FEMALE', ARRAY['Rajasthani','Hindi'],TRUE,  88.00,  600.00,  3600.00, 10,  'loc_jaipur_01',    4.70, 314, 334, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- WORKER SKILLS (2–3 skills per worker)
-- ============================================================
INSERT INTO worker_skills (id, worker_id, skill_id, level, years_of_experience, is_verified) VALUES
  -- wkr_01 Ramesh Yadav — Masonry(EXPERT 8yr), Tile Work(ADVANCED 5yr)
  ('ws_01_mas', 'wkr_01', 'skl_masonry',   'EXPERT',        8, TRUE),
  ('ws_01_til', 'wkr_01', 'skl_tiling',    'ADVANCED',      5, TRUE),
  -- wkr_02 Kavitha Nair — Cooking(EXPERT 5yr), Housekeeping(ADVANCED 5yr)
  ('ws_02_coo', 'wkr_02', 'skl_cooking',     'EXPERT',      5, TRUE),
  ('ws_02_hsk', 'wkr_02', 'skl_housekeeping','ADVANCED',    5, TRUE),
  -- wkr_03 Arun Kumar — Electrical(EXPERT 10yr), Computer Repair(ADVANCED 4yr)
  ('ws_03_ele', 'wkr_03', 'skl_electrical', 'EXPERT',      10, TRUE),
  ('ws_03_pcr', 'wkr_03', 'skl_pc_repair',  'ADVANCED',     4, TRUE),
  -- wkr_04 Lakshmi Devi — Cooking(INTERMEDIATE 3yr), Gardening(BEGINNER 1yr)
  ('ws_04_coo', 'wkr_04', 'skl_cooking',    'INTERMEDIATE', 3, FALSE),
  ('ws_04_grd', 'wkr_04', 'skl_gardening',  'BEGINNER',     1, FALSE),
  -- wkr_05 Santosh Gupta — Carpentry(EXPERT 12yr), Painting(ADVANCED 8yr)
  ('ws_05_car', 'wkr_05', 'skl_carpentry',  'EXPERT',      12, TRUE),
  ('ws_05_pnt', 'wkr_05', 'skl_painting',   'ADVANCED',     8, TRUE),
  -- wkr_06 Meena Patel — Housekeeping(ADVANCED 6yr), Cooking(INTERMEDIATE 4yr)
  ('ws_06_hsk', 'wkr_06', 'skl_housekeeping','ADVANCED',    6, TRUE),
  ('ws_06_coo', 'wkr_06', 'skl_cooking',    'INTERMEDIATE', 4, FALSE),
  -- wkr_07 Dinesh Rawat — Welding(EXPERT 15yr), Machine Operation(ADVANCED 10yr)
  ('ws_07_wel', 'wkr_07', 'skl_welding',    'EXPERT',      15, TRUE),
  ('ws_07_mop', 'wkr_07', 'skl_machine_op', 'ADVANCED',    10, TRUE),
  -- wkr_08 Pooja Mishra — Cooking(INTERMEDIATE 4yr), Housekeeping(INTERMEDIATE 4yr), Gardening(BEGINNER 2yr)
  ('ws_08_coo', 'wkr_08', 'skl_cooking',    'INTERMEDIATE', 4, FALSE),
  ('ws_08_hsk', 'wkr_08', 'skl_housekeeping','INTERMEDIATE',4, FALSE),
  ('ws_08_grd', 'wkr_08', 'skl_gardening',  'BEGINNER',     2, FALSE),
  -- wkr_09 Rajendra Thakur — Plumbing(EXPERT 9yr), Tile Work(ADVANCED 6yr)
  ('ws_09_plu', 'wkr_09', 'skl_plumbing',   'EXPERT',       9, TRUE),
  ('ws_09_til', 'wkr_09', 'skl_tiling',     'ADVANCED',     6, TRUE),
  -- wkr_10 Suman Bai — Housekeeping(ADVANCED 7yr), Cooking(INTERMEDIATE 5yr)
  ('ws_10_hsk', 'wkr_10', 'skl_housekeeping','ADVANCED',    7, TRUE),
  ('ws_10_coo', 'wkr_10', 'skl_cooking',    'INTERMEDIATE', 5, FALSE),
  -- wkr_11 Manoj Tiwari — Driving(EXPERT 11yr), Loading/Unloading(ADVANCED 8yr)
  ('ws_11_drv', 'wkr_11', 'skl_driving',    'EXPERT',      11, TRUE),
  ('ws_11_lod', 'wkr_11', 'skl_loading',    'ADVANCED',     8, TRUE),
  -- wkr_12 Geeta Sharma — Cooking(EXPERT 8yr), Housekeeping(EXPERT 8yr)
  ('ws_12_coo', 'wkr_12', 'skl_cooking',    'EXPERT',       8, TRUE),
  ('ws_12_hsk', 'wkr_12', 'skl_housekeeping','EXPERT',      8, TRUE),
  -- wkr_13 Prakash Verma — Electrical(ADVANCED 6yr), Mobile Repair(INTERMEDIATE 3yr)
  ('ws_13_ele', 'wkr_13', 'skl_electrical', 'ADVANCED',     6, TRUE),
  ('ws_13_mob', 'wkr_13', 'skl_mob_repair', 'INTERMEDIATE', 3, FALSE),
  -- wkr_14 Ritu Soni — Quality Control(INTERMEDIATE 4yr), Machine Operation(INTERMEDIATE 3yr)
  ('ws_14_qc',  'wkr_14', 'skl_qc',         'INTERMEDIATE', 4, FALSE),
  ('ws_14_mop', 'wkr_14', 'skl_machine_op', 'INTERMEDIATE', 3, FALSE),
  -- wkr_15 Harish Chandra — Masonry(EXPERT 20yr), Painting(EXPERT 15yr), Tile Work(EXPERT 12yr)
  ('ws_15_mas', 'wkr_15', 'skl_masonry',    'EXPERT',      20, TRUE),
  ('ws_15_pnt', 'wkr_15', 'skl_painting',   'EXPERT',      15, TRUE),
  ('ws_15_til', 'wkr_15', 'skl_tiling',     'EXPERT',      12, TRUE),
  -- wkr_16 Ananya Joshi — Cooking(BEGINNER 2yr), Housekeeping(BEGINNER 1yr), Gardening(BEGINNER 1yr)
  ('ws_16_coo', 'wkr_16', 'skl_cooking',    'BEGINNER',     2, FALSE),
  ('ws_16_hsk', 'wkr_16', 'skl_housekeeping','BEGINNER',    1, FALSE),
  ('ws_16_grd', 'wkr_16', 'skl_gardening',  'BEGINNER',     1, FALSE),
  -- wkr_17 Deepak Pandey — Carpentry(EXPERT 13yr), Welding(ADVANCED 8yr)
  ('ws_17_car', 'wkr_17', 'skl_carpentry',  'EXPERT',      13, TRUE),
  ('ws_17_wel', 'wkr_17', 'skl_welding',    'ADVANCED',     8, TRUE),
  -- wkr_18 Nirmala Singh — Farming(EXPERT 16yr), Harvesting(EXPERT 14yr)
  ('ws_18_frm', 'wkr_18', 'skl_farming',    'EXPERT',      16, TRUE),
  ('ws_18_hrv', 'wkr_18', 'skl_harvesting', 'EXPERT',      14, TRUE),
  -- wkr_19 Bharat Lal — Driving(ADVANCED 7yr), Machine Operation(INTERMEDIATE 4yr)
  ('ws_19_drv', 'wkr_19', 'skl_driving',    'ADVANCED',     7, TRUE),
  ('ws_19_mop', 'wkr_19', 'skl_machine_op', 'INTERMEDIATE', 4, FALSE),
  -- wkr_20 Sarla Devi — Cooking(EXPERT 10yr), Housekeeping(ADVANCED 8yr)
  ('ws_20_coo', 'wkr_20', 'skl_cooking',    'EXPERT',      10, TRUE),
  ('ws_20_hsk', 'wkr_20', 'skl_housekeeping','ADVANCED',    8, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SITES (5 construction sites across India)
-- ============================================================
INSERT INTO sites (id, contractor_id, name, description, address, city, state, pincode, latitude, longitude, radius_meters, is_active, total_workers) VALUES
  ('ste_01', 'con_01', 'Andheri Residential Complex',   'High-rise residential project in Andheri West',      'Plot 45, MIDC, Andheri West',          'Mumbai',    'Maharashtra', '400053', 19.1234, 72.8456, 300, TRUE, 35),
  ('ste_02', 'con_02', 'Connaught Place Office Fit-out', 'Interior renovation of heritage office building',    'Block D, Connaught Place',              'Delhi',     'Delhi',       '110001', 28.6315, 77.2167, 200, TRUE, 22),
  ('ste_03', 'con_03', 'Whitefield Tech Park',           'Electrical infrastructure for new IT campus',        'Plot 12, EPIP Zone, Whitefield',        'Bangalore', 'Karnataka',   '560066', 12.9716, 77.7499, 400, TRUE, 48),
  ('ste_04', 'con_04', 'OMR Road Housing Project',       'Plumbing & sanitation for gated community',          'Survey No. 99, OMR Road',               'Chennai',   'Tamil Nadu',  '600097', 12.9098, 80.2267, 250, TRUE, 18),
  ('ste_05', 'con_05', 'Gachibowli Commercial Tower',    'HVAC installation for 22-floor commercial tower',    'Survey No. 78, Gachibowli',             'Hyderabad', 'Telangana',   '500032', 17.4435, 78.3489, 350, TRUE, 29)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- JOBS (50 jobs across all contractors, cities, skills)
-- ============================================================
INSERT INTO jobs (
  id, contractor_id, site_id, title, description,
  required_skill_id, skill_category, worker_count, filled_count,
  daily_wage, weekly_wage, job_type, status,
  city, state, is_urgent, view_count, published_at, start_date, end_date
) VALUES
  -- con_01 Mumbai jobs
  ('job_01','con_01','ste_01','Senior Mason – High Rise Project',   'Experienced mason needed for RCC block work and plastering on 22-floor residential tower.',  'skl_masonry',   'Construction', 5, 2, 900.00,  5500.00, 'WEEKLY',   'PUBLISHED', 'Mumbai',    'Maharashtra', FALSE, 245, NOW()-INTERVAL '5 days',  NOW()+INTERVAL '3 days',  NOW()+INTERVAL '90 days'),
  ('job_02','con_01','ste_01','Tile Work Specialist',               'Skilled tiler required for kitchen and bathroom flooring, 600×600 vitrified tiles.',         'skl_tiling',    'Construction', 3, 1, 800.00,  4800.00, 'WEEKLY',   'PUBLISHED', 'Mumbai',    'Maharashtra', FALSE, 189, NOW()-INTERVAL '4 days',  NOW()+INTERVAL '5 days',  NOW()+INTERVAL '60 days'),
  ('job_03','con_01',NULL,    'Painting Supervisor',                'Supervise 10-person painting team for commercial complex, interior & exterior.',             'skl_painting',  'Construction', 2, 0, 1200.00, 7000.00, 'WEEKLY',   'PUBLISHED', 'Mumbai',    'Maharashtra', TRUE,  312, NOW()-INTERVAL '2 days',  NOW()+INTERVAL '1 days',  NOW()+INTERVAL '45 days'),
  ('job_04','con_01',NULL,    'Carpenter – Modular Kitchen',        'Install modular kitchen cabinets, wardrobes, and wooden false ceiling in 50 apartments.',    'skl_carpentry', 'Construction', 4, 0, 950.00,  5800.00, 'WEEKLY',   'PUBLISHED', 'Pune',      'Maharashtra', FALSE, 156, NOW()-INTERVAL '6 days',  NOW()+INTERVAL '7 days',  NOW()+INTERVAL '75 days'),
  ('job_05','con_01',NULL,    'Plumber – High Rise',                'Plumbing work for 22-floor residential building including GI pipe, CPVC, and drainage.',     'skl_plumbing',  'Construction', 3, 0, 850.00,  5200.00, 'WEEKLY',   'ACTIVE',    'Mumbai',    'Maharashtra', FALSE, 201, NOW()-INTERVAL '10 days', NOW()-INTERVAL '3 days',  NOW()+INTERVAL '60 days'),

  -- con_02 Delhi jobs
  ('job_06','con_02','ste_02','Interior Renovation Carpenter',      'Office furniture installation and wood panelling work for heritage building renovation.',     'skl_carpentry', 'Construction', 6, 3, 900.00,  5500.00, 'WEEKLY',   'PUBLISHED', 'Delhi',     'Delhi',       FALSE, 178, NOW()-INTERVAL '3 days',  NOW()+INTERVAL '2 days',  NOW()+INTERVAL '50 days'),
  ('job_07','con_02','ste_02','Painter – Commercial Office',        'Professional painting team for office complex, emulsion and texture finish work.',            'skl_painting',  'Construction', 4, 0, 750.00,  4500.00, 'WEEKLY',   'PUBLISHED', 'Delhi',     'Delhi',       FALSE, 143, NOW()-INTERVAL '4 days',  NOW()+INTERVAL '3 days',  NOW()+INTERVAL '40 days'),
  ('job_08','con_02',NULL,    'Electrician – Office Fitout',        'Electrical wiring, conduit, distribution panels for 8-floor commercial building.',           'skl_electrical','Construction', 5, 0, 1000.00, 6000.00, 'WEEKLY',   'PUBLISHED', 'Delhi',     'Delhi',       TRUE,  289, NOW()-INTERVAL '1 days',  NOW()+INTERVAL '2 days',  NOW()+INTERVAL '55 days'),
  ('job_09','con_02',NULL,    'Mason – Boundary Wall',              'Brick boundary wall construction and plastering for 2-acre industrial plot.',                 'skl_masonry',   'Construction', 8, 0, 700.00,  4200.00, 'WEEKLY',   'PUBLISHED', 'Delhi',     'Delhi',       FALSE, 98,  NOW()-INTERVAL '7 days',  NOW()+INTERVAL '5 days',  NOW()+INTERVAL '30 days'),
  ('job_10','con_02',NULL,    'Daily Labour – Demolition',          'Manual demolition of old structure, debris clearing and disposal.',                          NULL,            'Construction', 10, 0, 650.00, 3900.00, 'WEEKLY',   'PUBLISHED', 'Delhi',     'Delhi',       TRUE,  345, NOW()-INTERVAL '2 days',  NOW()+INTERVAL '1 days',  NOW()+INTERVAL '15 days'),

  -- con_03 Bangalore jobs
  ('job_11','con_03','ste_03','Senior Electrician – IT Campus',     'Complete electrical infrastructure for 500,000 sq ft IT campus, HT/LT panels, UPS systems.','skl_electrical','Construction', 8, 2, 1200.00, 7200.00, 'WEEKLY',   'PUBLISHED', 'Bangalore', 'Karnataka',   FALSE, 456, NOW()-INTERVAL '8 days',  NOW()-INTERVAL '1 days',  NOW()+INTERVAL '120 days'),
  ('job_12','con_03','ste_03','Solar Panel Installer',              'Install 200kW rooftop solar PV system on IT campus building, mounting and wiring.',           'skl_electrical','Construction', 4, 0, 1100.00, 6600.00, 'WEEKLY',   'PUBLISHED', 'Bangalore', 'Karnataka',   FALSE, 234, NOW()-INTERVAL '3 days',  NOW()+INTERVAL '4 days',  NOW()+INTERVAL '45 days'),
  ('job_13','con_03',NULL,    'Computer Hardware Technician',       'Set up 500 workstations, networking, cabling for new IT campus.',                            'skl_pc_repair', 'Technology',   6, 0, 900.00,  5400.00, 'WEEKLY',   'PUBLISHED', 'Bangalore', 'Karnataka',   FALSE, 312, NOW()-INTERVAL '5 days',  NOW()+INTERVAL '2 days',  NOW()+INTERVAL '30 days'),
  ('job_14','con_03',NULL,    'Mobile Repair Technician',           'Service centre technician for smartphone repair kiosk at IT campus.',                        'skl_mob_repair','Technology',   2, 0, 800.00,  4800.00, 'WEEKLY',   'PUBLISHED', 'Bangalore', 'Karnataka',   FALSE, 189, NOW()-INTERVAL '4 days',  NOW()+INTERVAL '3 days',  NOW()+INTERVAL '180 days'),
  ('job_15','con_03',NULL,    'Electrician Helper',                 'Assist senior electricians in cable pulling, conduit bending, and panel termination.',       'skl_electrical','Construction', 5, 0, 600.00,  3600.00, 'WEEKLY',   'PUBLISHED', 'Bangalore', 'Karnataka',   FALSE, 145, NOW()-INTERVAL '6 days',  NOW()+INTERVAL '5 days',  NOW()+INTERVAL '60 days'),

  -- con_04 Chennai jobs
  ('job_16','con_04','ste_04','Lead Plumber – Gated Community',     'Install water supply, drainage, and sewage treatment plant for 200-unit gated community.',   'skl_plumbing',  'Construction', 4, 1, 1000.00, 6000.00, 'WEEKLY',   'PUBLISHED', 'Chennai',   'Tamil Nadu',  FALSE, 267, NOW()-INTERVAL '9 days',  NOW()-INTERVAL '2 days',  NOW()+INTERVAL '90 days'),
  ('job_17','con_04','ste_04','Tile Work – Bathroom Finishing',     'Premium tile work for 200 bathrooms in gated community, 600×1200 large format tiles.',       'skl_tiling',    'Construction', 6, 0, 850.00,  5100.00, 'WEEKLY',   'PUBLISHED', 'Chennai',   'Tamil Nadu',  FALSE, 198, NOW()-INTERVAL '4 days',  NOW()+INTERVAL '3 days',  NOW()+INTERVAL '70 days'),
  ('job_18','con_04',NULL,    'Housekeeping Staff',                 'Domestic helpers for residential complex common areas, daily cleaning and maintenance.',      'skl_housekeeping','Domestic',   8, 0, 450.00,  2700.00, 'WEEKLY',   'PUBLISHED', 'Chennai',   'Tamil Nadu',  FALSE, 134, NOW()-INTERVAL '3 days',  NOW()+INTERVAL '2 days',  NOW()+INTERVAL '365 days'),
  ('job_19','con_04',NULL,    'Cook – Canteen',                     'Cook for construction site canteen, North Indian and South Indian cuisine, 50 workers.',      'skl_cooking',   'Domestic',     2, 0, 700.00,  4200.00, 'WEEKLY',   'PUBLISHED', 'Chennai',   'Tamil Nadu',  FALSE, 156, NOW()-INTERVAL '5 days',  NOW()+INTERVAL '1 days',  NOW()+INTERVAL '120 days'),
  ('job_20','con_04',NULL,    'Mason – Compound Wall',              'Build compound wall and entrance gate structure for 5-acre plot.',                            'skl_masonry',   'Construction', 4, 0, 750.00,  4500.00, 'WEEKLY',   'PUBLISHED', 'Chennai',   'Tamil Nadu',  TRUE,  278, NOW()-INTERVAL '1 days',  NOW()+INTERVAL '2 days',  NOW()+INTERVAL '25 days'),

  -- con_05 Hyderabad jobs
  ('job_21','con_05','ste_05','HVAC Technician – Commercial Tower', 'Install VRF air conditioning systems in 22-floor commercial tower, ducting, and controls.',  NULL,            'Construction', 6, 2, 1300.00, 7800.00, 'WEEKLY',   'PUBLISHED', 'Hyderabad', 'Telangana',   FALSE, 389, NOW()-INTERVAL '12 days', NOW()-INTERVAL '5 days',  NOW()+INTERVAL '150 days'),
  ('job_22','con_05','ste_05','Welder – Duct Fabrication',          'Fabricate and install GI sheet metal ducts for HVAC system, TIG/MIG welding required.',      'skl_welding',   'Construction', 4, 0, 1200.00, 7200.00, 'WEEKLY',   'PUBLISHED', 'Hyderabad', 'Telangana',   FALSE, 223, NOW()-INTERVAL '6 days',  NOW()+INTERVAL '4 days',  NOW()+INTERVAL '60 days'),
  ('job_23','con_05',NULL,    'Machine Operator – CNC',             'Operate CNC press brake for duct fabrication in workshop.',                                   'skl_machine_op','Manufacturing',3, 0, 1100.00, 6600.00, 'WEEKLY',   'PUBLISHED', 'Hyderabad', 'Telangana',   FALSE, 167, NOW()-INTERVAL '4 days',  NOW()+INTERVAL '3 days',  NOW()+INTERVAL '90 days'),
  ('job_24','con_05',NULL,    'Plumber – Commercial',               'Plumbing for commercial tower: fire hydrant system, water supply, drainage.',                 'skl_plumbing',  'Construction', 3, 0, 950.00,  5700.00, 'WEEKLY',   'PUBLISHED', 'Hyderabad', 'Telangana',   FALSE, 198, NOW()-INTERVAL '3 days',  NOW()+INTERVAL '2 days',  NOW()+INTERVAL '75 days'),
  ('job_25','con_05',NULL,    'Quality Control Inspector',          'QC inspection for HVAC duct fabrication – sheet metal gauge, joint quality, leakage testing.','skl_qc',        'Manufacturing',2, 0, 900.00,  5400.00, 'WEEKLY',   'PUBLISHED', 'Hyderabad', 'Telangana',   FALSE, 145, NOW()-INTERVAL '5 days',  NOW()+INTERVAL '3 days',  NOW()+INTERVAL '120 days'),

  -- Daily wage jobs across cities
  ('job_26','con_01',NULL,    'Daily Mason',                        'Daily wage mason for small repairs and patch plastering.',                                    'skl_masonry',   'Construction', 2, 0, 700.00,  NULL,    'DAILY',    'PUBLISHED', 'Mumbai',    'Maharashtra', FALSE, 78,  NOW()-INTERVAL '2 days',  NOW()+INTERVAL '1 days',  NOW()+INTERVAL '30 days'),
  ('job_27','con_02',NULL,    'Daily Electrician',                  'Daily electrician for minor electrical works and maintenance at commercial complex.',         'skl_electrical','Construction', 2, 0, 900.00,  NULL,    'DAILY',    'PUBLISHED', 'Delhi',     'Delhi',       FALSE, 92,  NOW()-INTERVAL '3 days',  NOW()+INTERVAL '1 days',  NOW()+INTERVAL '15 days'),
  ('job_28','con_03',NULL,    'Daily Carpenter',                    'Daily carpenter for snag fixing and furniture touch-up.',                                     'skl_carpentry', 'Construction', 1, 0, 800.00,  NULL,    'DAILY',    'PUBLISHED', 'Bangalore', 'Karnataka',   FALSE, 65,  NOW()-INTERVAL '1 days',  NOW()+INTERVAL '1 days',  NOW()+INTERVAL '7 days'),
  ('job_29','con_04',NULL,    'Daily Plumber',                      'On-call plumber for leakage repairs and tap fixing.',                                         'skl_plumbing',  'Construction', 1, 0, 750.00,  NULL,    'DAILY',    'PUBLISHED', 'Chennai',   'Tamil Nadu',  FALSE, 56,  NOW()-INTERVAL '2 days',  NOW()+INTERVAL '1 days',  NOW()+INTERVAL '30 days'),
  ('job_30','con_05',NULL,    'Daily Welder',                       'Daily welder for structural repairs and miscellaneous fabrication.',                          'skl_welding',   'Construction', 2, 0, 1100.00, NULL,    'DAILY',    'PUBLISHED', 'Hyderabad', 'Telangana',   FALSE, 87,  NOW()-INTERVAL '4 days',  NOW()+INTERVAL '1 days',  NOW()+INTERVAL '10 days'),

  -- Domestic & Transport jobs
  ('job_31','con_01',NULL,    'Domestic Cook',                      'Full-time cook for worker hostel, 100 workers, breakfast, lunch and dinner.',                'skl_cooking',   'Domestic',     1, 0, 600.00,  3600.00, 'WEEKLY',   'PUBLISHED', 'Mumbai',    'Maharashtra', FALSE, 145, NOW()-INTERVAL '5 days',  NOW()+INTERVAL '3 days',  NOW()+INTERVAL '365 days'),
  ('job_32','con_02',NULL,    'Housekeeping Staff',                 'Two housekeepers for office complex, daily cleaning of 3 floors.',                           'skl_housekeeping','Domestic',   2, 0, 450.00,  2700.00, 'WEEKLY',   'PUBLISHED', 'Delhi',     'Delhi',       FALSE, 123, NOW()-INTERVAL '4 days',  NOW()+INTERVAL '2 days',  NOW()+INTERVAL '180 days'),
  ('job_33','con_03',NULL,    'Driver – Material Transport',        'Experienced LMV driver for daily material transport between warehouse and site.',             'skl_driving',   'Transport',    2, 0, 750.00,  4500.00, 'WEEKLY',   'PUBLISHED', 'Bangalore', 'Karnataka',   FALSE, 178, NOW()-INTERVAL '6 days',  NOW()+INTERVAL '4 days',  NOW()+INTERVAL '90 days'),
  ('job_34','con_04',NULL,    'Loading/Unloading Labour',           'Manual loading and unloading of construction materials at warehouse.',                        'skl_loading',   'Transport',    5, 0, 500.00,  3000.00, 'WEEKLY',   'PUBLISHED', 'Chennai',   'Tamil Nadu',  FALSE, 89,  NOW()-INTERVAL '3 days',  NOW()+INTERVAL '1 days',  NOW()+INTERVAL '30 days'),
  ('job_35','con_05',NULL,    'Driver – HMV Truck',                 'HMV driver for sand, gravel, and material transport to Gachibowli site.',                    'skl_driving',   'Transport',    3, 0, 900.00,  5400.00, 'WEEKLY',   'PUBLISHED', 'Hyderabad', 'Telangana',   FALSE, 134, NOW()-INTERVAL '5 days',  NOW()+INTERVAL '2 days',  NOW()+INTERVAL '45 days'),

  -- Manufacturing & Agriculture
  ('job_36','con_02',NULL,    'Machine Operator – Fabrication Shop', 'Operate press brake, roll bending, and laser cutting machines for fabrication.',            'skl_machine_op','Manufacturing',4, 0, 1000.00, 6000.00, 'WEEKLY',   'PUBLISHED', 'Delhi',     'Delhi',       FALSE, 198, NOW()-INTERVAL '7 days',  NOW()+INTERVAL '5 days',  NOW()+INTERVAL '60 days'),
  ('job_37','con_03',NULL,    'QC Analyst – Manufacturing',         'Quality inspection for manufactured products, measurement, documentation.',                  'skl_qc',        'Manufacturing',2, 0, 950.00,  5700.00, 'WEEKLY',   'PUBLISHED', 'Bangalore', 'Karnataka',   FALSE, 156, NOW()-INTERVAL '4 days',  NOW()+INTERVAL '3 days',  NOW()+INTERVAL '90 days'),
  ('job_38','con_01',NULL,    'Gardener – Landscape',               'Landscape gardener for residential complex common areas, plants, lawn maintenance.',         'skl_gardening', 'Domestic',     2, 0, 550.00,  3300.00, 'WEEKLY',   'PUBLISHED', 'Pune',      'Maharashtra', FALSE, 112, NOW()-INTERVAL '3 days',  NOW()+INTERVAL '2 days',  NOW()+INTERVAL '365 days'),
  ('job_39','con_05',NULL,    'Farm Labour',                        'Agricultural labour for paddy cultivation, transplanting season.',                           'skl_farming',   'Agriculture',  10, 0, 400.00,  2400.00, 'WEEKLY',   'PUBLISHED', 'Hyderabad', 'Telangana',   FALSE, 87,  NOW()-INTERVAL '2 days',  NOW()+INTERVAL '5 days',  NOW()+INTERVAL '30 days'),
  ('job_40','con_04',NULL,    'Harvesting Labour',                  'Crop harvesting and threshing for 20-acre mango orchard.',                                   'skl_harvesting','Agriculture',  15, 0, 380.00,  2280.00, 'WEEKLY',   'PUBLISHED', 'Chennai',   'Tamil Nadu',  FALSE, 76,  NOW()-INTERVAL '1 days',  NOW()+INTERVAL '7 days',  NOW()+INTERVAL '20 days'),

  -- High-value contract jobs
  ('job_41','con_01',NULL,    'Civil Contractor – Sublet',          'Sublet civil work for 30 apartments finishing, plastering, tile, paint.',                    NULL,            'Construction', 15, 0, 800.00,  NULL,    'CONTRACT', 'PUBLISHED', 'Mumbai',    'Maharashtra', FALSE, 289, NOW()-INTERVAL '8 days',  NOW()+INTERVAL '7 days',  NOW()+INTERVAL '120 days'),
  ('job_42','con_03',NULL,    'Electrical Supervisor',              'Supervise electrical work for entire IT campus, 15-member team, progress reporting.',        'skl_electrical','Construction', 1, 0, 2000.00, NULL,    'CONTRACT', 'PUBLISHED', 'Bangalore', 'Karnataka',   FALSE, 345, NOW()-INTERVAL '10 days', NOW()-INTERVAL '2 days',  NOW()+INTERVAL '180 days'),
  ('job_43','con_05',NULL,    'HVAC Project Manager',               'Manage entire HVAC installation for 22-floor tower, vendor coordination.',                   NULL,            'Construction', 1, 0, 2500.00, NULL,    'CONTRACT', 'PUBLISHED', 'Hyderabad', 'Telangana',   FALSE, 412, NOW()-INTERVAL '12 days', NOW()-INTERVAL '5 days',  NOW()+INTERVAL '200 days'),
  ('job_44','con_02',NULL,    'Interior Design Carpenter',          'Complete carpentry for 50 luxury apartments – wardrobes, kitchen, study units.',             'skl_carpentry', 'Construction', 8, 0, 1100.00, NULL,    'CONTRACT', 'PUBLISHED', 'Delhi',     'Delhi',       FALSE, 267, NOW()-INTERVAL '6 days',  NOW()+INTERVAL '4 days',  NOW()+INTERVAL '90 days'),
  ('job_45','con_04',NULL,    'Plumbing Subcontractor',             'Full plumbing subcontract for phase 2 of gated community, 100 units.',                       'skl_plumbing',  'Construction', 6, 0, 900.00,  NULL,    'CONTRACT', 'PUBLISHED', 'Chennai',   'Tamil Nadu',  FALSE, 198, NOW()-INTERVAL '5 days',  NOW()+INTERVAL '10 days', NOW()+INTERVAL '150 days'),

  -- Urgent jobs
  ('job_46','con_01',NULL,    'Emergency Electrician',              'URGENT: Power failure at residential complex, immediate electrical fault diagnosis needed.',  'skl_electrical','Construction', 2, 0, 1500.00, NULL,    'DAILY',    'PUBLISHED', 'Mumbai',    'Maharashtra', TRUE,  567, NOW()-INTERVAL '1 days',  NOW()+INTERVAL '1 days',  NOW()+INTERVAL '3 days'),
  ('job_47','con_04',NULL,    'Emergency Plumber',                  'URGENT: Major water pipe burst at construction site, immediate repair required.',             'skl_plumbing',  'Construction', 1, 0, 1200.00, NULL,    'DAILY',    'PUBLISHED', 'Chennai',   'Tamil Nadu',  TRUE,  423, NOW()-INTERVAL '1 days',  NOW()+INTERVAL '1 days',  NOW()+INTERVAL '2 days'),
  ('job_48','con_02',NULL,    'Urgent Painter',                     'URGENT: Building inauguration in 2 days, 3 floors of painting to be finished.',              'skl_painting',  'Construction', 6, 0, 1100.00, NULL,    'DAILY',    'PUBLISHED', 'Delhi',     'Delhi',       TRUE,  389, NOW()-INTERVAL '1 days',  NOW()+INTERVAL '1 days',  NOW()+INTERVAL '2 days'),

  -- Monthly fixed-term
  ('job_49','con_03',NULL,    'Full-time Cook',                     'Monthly cook for IT campus food court, 200 staff, multi-cuisine required.',                  'skl_cooking',   'Domestic',     3, 0, 18000.00,NULL,    'MONTHLY',  'PUBLISHED', 'Bangalore', 'Karnataka',   FALSE, 234, NOW()-INTERVAL '9 days',  NOW()+INTERVAL '5 days',  NOW()+INTERVAL '365 days'),
  ('job_50','con_05',NULL,    'Security Guard',                     'Monthly security guard for commercial tower premises, day shift.',                           NULL,            'Construction', 4, 0, 12000.00,NULL,    'MONTHLY',  'PUBLISHED', 'Hyderabad', 'Telangana',   FALSE, 178, NOW()-INTERVAL '7 days',  NOW()+INTERVAL '3 days',  NOW()+INTERVAL '365 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- JOB APPLICATIONS (100 applications across jobs and workers)
-- ============================================================
INSERT INTO job_applications (id, job_id, worker_id, status, cover_note, applied_at) VALUES
  -- job_01 Masonry (5 workers applied)
  ('app_001','job_01','wkr_01','HIRED',       'I have 8 years masonry experience. Expert in RCC block work and plastering. Available immediately.', NOW()-INTERVAL '4 days'),
  ('app_002','job_01','wkr_09','SHORTLISTED', 'Expert plumber with 9 years experience, also skilled in masonry.',                                  NOW()-INTERVAL '3 days'),
  ('app_003','job_01','wkr_15','SHORTLISTED', '20 years masonry experience, including high-rise projects.',                                        NOW()-INTERVAL '3 days'),
  ('app_004','job_01','wkr_05','SUBMITTED',   'Experienced construction worker, familiar with Mumbai high-rise projects.',                          NOW()-INTERVAL '2 days'),
  ('app_005','job_01','wkr_11','REJECTED',    'I can do masonry work, available from next week.',                                                   NOW()-INTERVAL '4 days'),

  -- job_02 Tile Work
  ('app_006','job_02','wkr_01','HIRED',       'Expert tile installer, 5 years experience with vitrified tiles, large format included.',            NOW()-INTERVAL '3 days'),
  ('app_007','job_02','wkr_09','SUBMITTED',   'Experienced in tile work alongside plumbing.',                                                       NOW()-INTERVAL '2 days'),
  ('app_008','job_02','wkr_15','SUBMITTED',   'Expert in all types of tile work.',                                                                  NOW()-INTERVAL '1 days'),
  ('app_009','job_02','wkr_07','SUBMITTED',   'Experienced welder and can do tile work too.',                                                       NOW()-INTERVAL '2 days'),

  -- job_03 Painting Supervisor
  ('app_010','job_03','wkr_05','SUBMITTED',   'Experienced painting supervisor, managed teams of 12+ painters.',                                   NOW()-INTERVAL '1 days'),
  ('app_011','job_03','wkr_15','SUBMITTED',   '15 years painting experience, have supervised 8-person teams.',                                     NOW()-INTERVAL '1 days'),
  ('app_012','job_03','wkr_07','VIEWED',      'Can supervise painting work alongside metalwork.',                                                   NOW()-INTERVAL '2 days'),

  -- job_05 Plumber
  ('app_013','job_05','wkr_09','HIRED',       'Expert plumber with 9 years experience in high-rise plumbing, including GI and CPVC.',              NOW()-INTERVAL '8 days'),
  ('app_014','job_05','wkr_04','SUBMITTED',   'Have 3 years plumbing experience, eager to take on larger projects.',                               NOW()-INTERVAL '5 days'),
  ('app_015','job_05','wkr_06','SUBMITTED',   'Experienced in residential plumbing.',                                                               NOW()-INTERVAL '3 days'),

  -- job_06 Interior Carpenter
  ('app_016','job_06','wkr_05','HIRED',       'Expert carpenter with 12 years exp, extensive office furniture installation experience.',            NOW()-INTERVAL '2 days'),
  ('app_017','job_06','wkr_17','HIRED',       '13 years carpentry experience including luxury office interiors.',                                   NOW()-INTERVAL '2 days'),
  ('app_018','job_06','wkr_07','HIRED',       'Expert welder and carpenter, versatile worker.',                                                    NOW()-INTERVAL '1 days'),
  ('app_019','job_06','wkr_04','SUBMITTED',   'Available for carpentry work in Delhi.',                                                             NOW()-INTERVAL '3 days'),
  ('app_020','job_06','wkr_16','SUBMITTED',   'Seeking work experience in carpentry.',                                                              NOW()-INTERVAL '1 days'),

  -- job_08 Delhi Electrician
  ('app_021','job_08','wkr_03','SUBMITTED',   'Expert electrician with 10 years exp, HT/LT work including commercial buildings.',                  NOW()-INTERVAL '1 days'),
  ('app_022','job_08','wkr_13','SUBMITTED',   'Advanced electrician with 6 years experience.',                                                     NOW()-INTERVAL '1 days'),
  ('app_023','job_08','wkr_07','VIEWED',      'Experienced in electrical work for industrial facilities.',                                          NOW()-INTERVAL '2 days'),

  -- job_09 Mason Boundary Wall
  ('app_024','job_09','wkr_01','SUBMITTED',   'Experienced mason, have done boundary wall work before.',                                           NOW()-INTERVAL '5 days'),
  ('app_025','job_09','wkr_15','SUBMITTED',   '20 years masonry, done 10+ boundary wall projects.',                                               NOW()-INTERVAL '4 days'),
  ('app_026','job_09','wkr_09','SUBMITTED',   'Available for masonry work in Delhi.',                                                               NOW()-INTERVAL '3 days'),

  -- job_10 Daily Labour
  ('app_027','job_10','wkr_04','SUBMITTED',   'Available for daily work.',                                                                          NOW()-INTERVAL '1 days'),
  ('app_028','job_10','wkr_08','SUBMITTED',   'Looking for daily work near Delhi.',                                                                 NOW()-INTERVAL '2 days'),
  ('app_029','job_10','wkr_16','SUBMITTED',   'Need work, physically fit and available immediately.',                                              NOW()-INTERVAL '1 days'),
  ('app_030','job_10','wkr_11','SUBMITTED',   'Experienced in loading and demolition work.',                                                       NOW()-INTERVAL '1 days'),

  -- job_11 Bangalore Electrician
  ('app_031','job_11','wkr_03','HIRED',       'Expert electrician, 10 years exp including campus projects, HT panels.',                           NOW()-INTERVAL '7 days'),
  ('app_032','job_11','wkr_13','HIRED',       'Advanced electrician, experienced in IT campus projects.',                                          NOW()-INTERVAL '6 days'),
  ('app_033','job_11','wkr_07','SUBMITTED',   'Experienced in electrical and mechanical work.',                                                    NOW()-INTERVAL '3 days'),

  -- job_12 Solar Installer
  ('app_034','job_12','wkr_03','SUBMITTED',   'Expert electrician, trained in solar panel installation.',                                          NOW()-INTERVAL '2 days'),
  ('app_035','job_12','wkr_13','SUBMITTED',   'Experienced in solar installations, EPC background.',                                              NOW()-INTERVAL '3 days'),
  ('app_036','job_12','wkr_07','SUBMITTED',   'Can do solar installation work.',                                                                   NOW()-INTERVAL '2 days'),

  -- job_13 Computer Hardware
  ('app_037','job_13','wkr_03','SUBMITTED',   'Expert in computer hardware and networking.',                                                       NOW()-INTERVAL '4 days'),
  ('app_038','job_13','wkr_13','SUBMITTED',   'Experienced in IT infrastructure setup.',                                                           NOW()-INTERVAL '3 days'),
  ('app_039','job_13','wkr_14','SUBMITTED',   'QC background, also experienced in hardware.',                                                     NOW()-INTERVAL '2 days'),

  -- job_16 Chennai Plumber
  ('app_040','job_16','wkr_09','HIRED',       'Expert plumber, done gated community projects in Chennai.',                                        NOW()-INTERVAL '8 days'),
  ('app_041','job_16','wkr_04','SUBMITTED',   'Experienced plumber, available for long-term work.',                                               NOW()-INTERVAL '5 days'),
  ('app_042','job_16','wkr_06','SUBMITTED',   'Can do plumbing work.',                                                                             NOW()-INTERVAL '4 days'),

  -- job_17 Tile Work Chennai
  ('app_043','job_17','wkr_01','SUBMITTED',   'Expert tile installer, 5 years exp with large format tiles.',                                      NOW()-INTERVAL '3 days'),
  ('app_044','job_17','wkr_09','SUBMITTED',   'Can do tile work alongside plumbing.',                                                              NOW()-INTERVAL '2 days'),
  ('app_045','job_17','wkr_15','SUBMITTED',   'Expert tiler, done bathroom finishing for 500+ units.',                                            NOW()-INTERVAL '2 days'),

  -- job_18 Housekeeping
  ('app_046','job_18','wkr_02','SUBMITTED',   'Expert housekeeper, 5 years experience.',                                                          NOW()-INTERVAL '2 days'),
  ('app_047','job_18','wkr_06','SUBMITTED',   'Advanced housekeeper, Chennai resident.',                                                           NOW()-INTERVAL '3 days'),
  ('app_048','job_18','wkr_10','SUBMITTED',   'Advanced housekeeper with 7 years experience.',                                                    NOW()-INTERVAL '1 days'),
  ('app_049','job_18','wkr_12','SUBMITTED',   'Expert cook and housekeeper combo, 8 years experience.',                                           NOW()-INTERVAL '2 days'),
  ('app_050','job_18','wkr_20','SUBMITTED',   'Advanced housekeeper, available for long-term.',                                                   NOW()-INTERVAL '1 days'),

  -- job_19 Cook Canteen
  ('app_051','job_19','wkr_02','SUBMITTED',   'Expert cook, 5 years, both North and South Indian cuisine.',                                       NOW()-INTERVAL '4 days'),
  ('app_052','job_19','wkr_12','SUBMITTED',   'Expert cook with 8 years experience, canteen work done before.',                                   NOW()-INTERVAL '3 days'),
  ('app_053','job_19','wkr_10','SUBMITTED',   'Experienced cook, 5 years.',                                                                       NOW()-INTERVAL '2 days'),

  -- job_20 Mason Chennai (urgent)
  ('app_054','job_20','wkr_01','SUBMITTED',   'Expert mason, available immediately for urgent work.',                                             NOW()-INTERVAL '1 days'),
  ('app_055','job_20','wkr_15','SUBMITTED',   '20 years mason, can start tomorrow.',                                                              NOW()-INTERVAL '1 days'),

  -- job_21 HVAC Hyderabad
  ('app_056','job_21','wkr_07','HIRED',       'Expert welder, extensive HVAC duct fabrication experience.',                                       NOW()-INTERVAL '10 days'),
  ('app_057','job_21','wkr_17','HIRED',       'Expert carpenter and welder, mechanical installations.',                                           NOW()-INTERVAL '9 days'),
  ('app_058','job_21','wkr_22','SUBMITTED',   'Experienced in HVAC system installation.',                                                         NOW()-INTERVAL '3 days') ON CONFLICT DO NOTHING;

INSERT INTO job_applications (id, job_id, worker_id, status, cover_note, applied_at) VALUES
  -- job_22 Welder Duct
  ('app_059','job_22','wkr_07','SUBMITTED',   'Expert welder, 15 years experience including duct fabrication.',                                   NOW()-INTERVAL '5 days'),
  ('app_060','job_22','wkr_17','SUBMITTED',   'Expert welder and carpenter, TIG/MIG certified.',                                                  NOW()-INTERVAL '4 days'),

  -- job_23 CNC Machine
  ('app_061','job_23','wkr_14','SUBMITTED',   'QC background, experienced with CNC machines.',                                                    NOW()-INTERVAL '3 days'),
  ('app_062','job_23','wkr_19','SUBMITTED',   'Machine operator, 4 years experience.',                                                            NOW()-INTERVAL '2 days'),
  ('app_063','job_23','wkr_07','SUBMITTED',   'Expert machine operator in fabrication context.',                                                  NOW()-INTERVAL '3 days'),

  -- job_25 QC Inspector
  ('app_064','job_25','wkr_14','SUBMITTED',   'QC analyst, 4 years experience including sheet metal.',                                           NOW()-INTERVAL '4 days'),
  ('app_065','job_25','wkr_03','SUBMITTED',   'Expert electrician, experienced in QC for installations.',                                        NOW()-INTERVAL '2 days'),

  -- job_31 Cook Hostel
  ('app_066','job_31','wkr_02','SUBMITTED',   'Expert cook, 5 years experience, large batch cooking for workers.',                               NOW()-INTERVAL '4 days'),
  ('app_067','job_31','wkr_12','SUBMITTED',   'Expert cook, 8 years, hostel canteen experience.',                                                NOW()-INTERVAL '3 days'),
  ('app_068','job_31','wkr_20','SUBMITTED',   'Expert cook, North and South Indian, available for Mumbai.',                                      NOW()-INTERVAL '2 days'),
  ('app_069','job_31','wkr_06','SUBMITTED',   'Can cook for workers, available for Mumbai.',                                                      NOW()-INTERVAL '2 days'),

  -- job_32 Housekeeping Delhi
  ('app_070','job_32','wkr_10','SUBMITTED',   'Advanced housekeeper, 7 years, available for Delhi.',                                             NOW()-INTERVAL '3 days'),
  ('app_071','job_32','wkr_06','SUBMITTED',   'Experienced housekeeper, available immediately.',                                                  NOW()-INTERVAL '2 days'),

  -- job_33 Driver Bangalore
  ('app_072','job_33','wkr_11','SUBMITTED',   'Expert driver, LMV/HMV licensed, 11 years exp.',                                                  NOW()-INTERVAL '5 days'),
  ('app_073','job_33','wkr_19','SUBMITTED',   'Experienced driver, 7 years, familiar with Bangalore roads.',                                     NOW()-INTERVAL '4 days'),

  -- job_34 Loading Labour
  ('app_074','job_34','wkr_11','SUBMITTED',   'Experienced in loading and unloading, physically fit.',                                           NOW()-INTERVAL '3 days'),
  ('app_075','job_34','wkr_04','SUBMITTED',   'Available for loading work.',                                                                      NOW()-INTERVAL '2 days'),
  ('app_076','job_34','wkr_08','SUBMITTED',   'Available for daily work.',                                                                        NOW()-INTERVAL '2 days'),
  ('app_077','job_34','wkr_16','SUBMITTED',   'Looking for loading/unloading work.',                                                              NOW()-INTERVAL '1 days'),

  -- job_35 HMV Driver
  ('app_078','job_35','wkr_11','SUBMITTED',   'Expert driver, HMV licensed, 11 years exp.',                                                      NOW()-INTERVAL '4 days'),
  ('app_079','job_35','wkr_19','SUBMITTED',   'HMV driver, 7 years experience.',                                                                 NOW()-INTERVAL '3 days'),

  -- job_36 Machine Operator Delhi
  ('app_080','job_36','wkr_07','SUBMITTED',   'Expert machine operator, 10 years, fabrication shop experience.',                                 NOW()-INTERVAL '5 days'),
  ('app_081','job_36','wkr_14','SUBMITTED',   'Machine operator with QC background.',                                                            NOW()-INTERVAL '4 days'),
  ('app_082','job_36','wkr_19','SUBMITTED',   'Machine operator, 4 years experience.',                                                           NOW()-INTERVAL '3 days'),

  -- job_38 Gardener
  ('app_083','job_38','wkr_04','SUBMITTED',   'Have gardening experience, happy to maintain lawns.',                                             NOW()-INTERVAL '2 days'),
  ('app_084','job_38','wkr_08','SUBMITTED',   'Can do gardening work, experienced.',                                                              NOW()-INTERVAL '1 days'),
  ('app_085','job_38','wkr_16','SUBMITTED',   'Interested in gardening work.',                                                                   NOW()-INTERVAL '2 days'),

  -- job_39 Farm Labour
  ('app_086','job_39','wkr_18','SUBMITTED',   'Expert farmer, 16 years paddy cultivation experience.',                                           NOW()-INTERVAL '1 days'),
  ('app_087','job_39','wkr_04','SUBMITTED',   'Experienced in farm labour.',                                                                     NOW()-INTERVAL '1 days'),

  -- job_40 Harvesting
  ('app_088','job_40','wkr_18','SUBMITTED',   'Expert harvesting, 14 years experience.',                                                         NOW()-INTERVAL '1 days'),
  ('app_089','job_40','wkr_20','SUBMITTED',   'Experienced in harvesting work.',                                                                  NOW()-INTERVAL '1 days'),

  -- job_41 Civil Sublet
  ('app_090','job_41','wkr_01','SUBMITTED',   'Expert mason, can manage 15-person team for apartment finishing.',                                 NOW()-INTERVAL '6 days'),
  ('app_091','job_41','wkr_15','SUBMITTED',   '20 years mason, have done apartment finishing for 200+ units.',                                   NOW()-INTERVAL '5 days'),

  -- job_42 Electrical Supervisor
  ('app_092','job_42','wkr_03','SUBMITTED',   'Expert electrician, 10 years, can supervise campus teams.',                                       NOW()-INTERVAL '8 days'),
  ('app_093','job_42','wkr_13','SUBMITTED',   'Advanced electrician, experienced in supervision.',                                               NOW()-INTERVAL '7 days'),

  -- job_44 Interior Carpenter Delhi
  ('app_094','job_44','wkr_05','SUBMITTED',   'Expert carpenter, 12 years, luxury apartment experience.',                                        NOW()-INTERVAL '4 days'),
  ('app_095','job_44','wkr_17','SUBMITTED',   'Expert carpenter, 13 years, done 100+ apartments.',                                              NOW()-INTERVAL '3 days'),

  -- job_46 Emergency Electrician
  ('app_096','job_46','wkr_03','SUBMITTED',   'Available immediately for emergency electrical work.',                                            NOW()-INTERVAL '4 hours'),
  ('app_097','job_46','wkr_13','SUBMITTED',   'Can arrive within 2 hours for emergency work.',                                                   NOW()-INTERVAL '3 hours'),

  -- job_47 Emergency Plumber
  ('app_098','job_47','wkr_09','SUBMITTED',   'Available immediately for emergency plumbing.',                                                   NOW()-INTERVAL '2 hours'),

  -- job_48 Urgent Painter
  ('app_099','job_48','wkr_05','SUBMITTED',   'Available immediately for urgent painting, can bring team.',                                      NOW()-INTERVAL '3 hours'),
  ('app_100','job_48','wkr_15','SUBMITTED',   'Expert painter, can finish 3 floors in 2 days.',                                                 NOW()-INTERVAL '2 hours')
ON CONFLICT DO NOTHING;

-- ============================================================
-- WORKER EXPERIENCE (2 experiences per top 10 workers)
-- ============================================================
INSERT INTO worker_experiences (id, worker_id, title, company, city, description, start_date, end_date, is_current) VALUES
  ('exp_01a','wkr_01','Senior Mason',            'BuildRight Construction',      'Mumbai',    'Led masonry team of 5, RCC work for 15-floor residential tower.',         '2016-04-01', '2022-03-31', FALSE),
  ('exp_01b','wkr_01','Master Mason',            'Self Employed',                'Mumbai',    'Independent masonry contractor for residential and commercial projects.',  '2022-04-01', NULL, TRUE),
  ('exp_02a','wkr_02','Head Cook',               'Hotel Surya',                  'Chennai',   'Managed kitchen for 100-cover restaurant, multi-cuisine.',                '2019-06-01', '2023-05-31', FALSE),
  ('exp_02b','wkr_02','Private Cook',            'Residential Client',           'Chennai',   'Personal chef for high-net-worth family.',                                '2023-06-01', NULL, TRUE),
  ('exp_03a','wkr_03','Lead Electrician',        'TechBuild Infrastructure',     'Bangalore', 'Electrical supervisor for IT parks, HT/LT panels, UPS systems.',         '2014-01-01', '2021-12-31', FALSE),
  ('exp_03b','wkr_03','Senior Electrician',      'Freelance',                    'Bangalore', 'Independent electrical contractor for commercial and industrial projects.','2022-01-01', NULL, TRUE),
  ('exp_05a','wkr_05','Carpenter Foreman',       'Rajesh Furniture Works',       'Delhi',     'Led 8-person carpentry team for modular kitchen and wardrobe installation.','2012-05-01', '2020-04-30', FALSE),
  ('exp_05b','wkr_05','Senior Carpenter',        'InteriorEdge Pvt Ltd',         'Delhi',     'Premium interior carpentry for luxury residential projects.',             '2020-05-01', NULL, TRUE),
  ('exp_07a','wkr_07','Senior Welder',           'Steel Fabricators India',      'Jaipur',    'Structural welding for industrial sheds, conveyors, and machine frames.', '2009-01-01', '2018-12-31', FALSE),
  ('exp_07b','wkr_07','Welding Supervisor',      'HVAC Solutions Ltd',           'Jaipur',    'Supervise duct fabrication welding team of 8 for HVAC projects.',         '2019-01-01', NULL, TRUE),
  ('exp_09a','wkr_09','Plumber',                 'Sunita Plumbing Services',     'Mumbai',    'Residential and commercial plumbing, GI and CPVC pipe work.',             '2015-03-01', '2020-02-28', FALSE),
  ('exp_09b','wkr_09','Senior Plumber',          'Anand Construction',           'Mumbai',    'Lead plumber for high-rise residential, fire hydrant and drainage.',       '2020-03-01', NULL, TRUE),
  ('exp_11a','wkr_11','Professional Driver',     'Shree Logistics',              'Delhi',     'LMV/HMV driver for goods transport across North India.',                  '2013-07-01', '2020-06-30', FALSE),
  ('exp_11b','wkr_11','Senior Driver',           'Construction Supplies Co.',    'Delhi',     'Material transport driver for construction sites in Delhi NCR.',          '2020-07-01', NULL, TRUE),
  ('exp_15a','wkr_15','Mason & Painter',         'Heritage Constructions',       'Pune',      'Expert mason and painter for heritage building restoration projects.',    '2004-01-01', '2018-12-31', FALSE),
  ('exp_15b','wkr_15','Master Craftsman',        'Premium Finishes Pvt Ltd',     'Pune',      'Master mason, tiler, and painter for luxury residential projects.',        '2019-01-01', NULL, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- WORKER RATINGS (for hired workers)
-- ============================================================
INSERT INTO worker_ratings (id, worker_id, contractor_id, job_id, rating, review) VALUES
  ('rat_01','wkr_01','con_01','job_01', 4.80, 'Excellent mason, finished ahead of schedule, clean work.'),
  ('rat_02','wkr_01','con_01','job_02', 4.70, 'Good tile work, precise cutting and grouting.'),
  ('rat_03','wkr_03','con_03','job_11', 5.00, 'Outstanding electrician, handled complex HT/LT work flawlessly.'),
  ('rat_04','wkr_05','con_02','job_06', 4.90, 'Excellent carpenter, finest quality furniture installation.'),
  ('rat_05','wkr_07','con_05','job_21', 4.80, 'Expert welder, perfect duct joints with zero leakage.'),
  ('rat_06','wkr_09','con_01','job_05', 4.70, 'Professional plumber, no snagging issues.'),
  ('rat_07','wkr_09','con_04','job_16', 4.90, 'Exceptional plumber, managed large community project superbly.'),
  ('rat_08','wkr_13','con_03','job_11', 4.60, 'Good electrician, reliable and hardworking.'),
  ('rat_09','wkr_15','con_01','job_01', 4.80, 'Highly experienced mason, great attention to detail.'),
  ('rat_10','wkr_17','con_02','job_06', 4.70, 'Skilled carpenter, good workmanship.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- VERIFY ROW COUNTS
-- ============================================================
DO $$
DECLARE
  v_locs   BIGINT; v_skills BIGINT; v_users  BIGINT; v_workers BIGINT;
  v_cons   BIGINT; v_comps  BIGINT; v_wskl   BIGINT;
  v_jobs   BIGINT; v_apps   BIGINT; v_sites  BIGINT;
BEGIN
  SELECT COUNT(*) INTO v_locs   FROM locations;
  SELECT COUNT(*) INTO v_skills FROM skills;
  SELECT COUNT(*) INTO v_users  FROM users;
  SELECT COUNT(*) INTO v_workers FROM workers;
  SELECT COUNT(*) INTO v_cons   FROM contractors;
  SELECT COUNT(*) INTO v_comps  FROM companies;
  SELECT COUNT(*) INTO v_wskl   FROM worker_skills;
  SELECT COUNT(*) INTO v_jobs   FROM jobs;
  SELECT COUNT(*) INTO v_apps   FROM job_applications;
  SELECT COUNT(*) INTO v_sites  FROM sites;

  RAISE NOTICE '=== Seed Verification ===';
  RAISE NOTICE 'Locations    : % (expected 10)',   v_locs;
  RAISE NOTICE 'Skills       : % (expected 18)',   v_skills;
  RAISE NOTICE 'Users        : % (expected 30)',   v_users;
  RAISE NOTICE 'Workers      : % (expected 20)',   v_workers;
  RAISE NOTICE 'Contractors  : % (expected 5)',    v_cons;
  RAISE NOTICE 'Companies    : % (expected 3)',    v_comps;
  RAISE NOTICE 'Worker Skills: % (expected 42)',   v_wskl;
  RAISE NOTICE 'Jobs         : % (expected 50)',   v_jobs;
  RAISE NOTICE 'Applications : % (expected 100)',  v_apps;
  RAISE NOTICE 'Sites        : % (expected 5)',    v_sites;

  IF v_workers <> 20 THEN RAISE EXCEPTION 'Worker count mismatch!'; END IF;
  IF v_cons    <>  5 THEN RAISE EXCEPTION 'Contractor count mismatch!'; END IF;
  IF v_comps   <>  3 THEN RAISE EXCEPTION 'Company count mismatch!'; END IF;
END $$;

COMMIT;

-- ============================================================
-- POST-SEED REPORT (runs outside the transaction)
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '╔══════════════════════════════════════════════════╗';
  RAISE NOTICE '║   Digital Labour Chowk — Seed Complete          ║';
  RAISE NOTICE '╠══════════════════════════════════════════════════╣';
  RAISE NOTICE '║  Super Admin  : superadmin@digitallabourchowk.com';
  RAISE NOTICE '║  Password     : Password@123                     ';
  RAISE NOTICE '║  Workers OTP  : +919700001001 → +919700001020   ';
  RAISE NOTICE '║  50 Jobs, 100 Applications seeded               ';
  RAISE NOTICE '╚══════════════════════════════════════════════════╝';
END $$;
