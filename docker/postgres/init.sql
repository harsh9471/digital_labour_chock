-- Digital Labour Chowk - PostgreSQL Initialization
-- This script runs once when the container is first created

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create additional indexes will be handled by Prisma migrations
-- This file is for extensions and database-level config only

-- Set timezone
SET timezone = 'Asia/Kolkata';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE digital_labour_chowk TO dlc_user;
