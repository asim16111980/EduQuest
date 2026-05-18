-- Enable Row Level Security (RLS) globally with default deny
-- This script enables RLS on all tables and implements the security-first principle

-- Enable RLS on all tables
DO $$
BEGIN
    -- Get all tables in the public schema
    FOR table_name IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename NOT IN ('migrations', 'supabase_migrations')
    LOOP
        -- Enable RLS on the table
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);

        -- Check if default deny policy already exists
        EXISTS (
            SELECT 1
            FROM pg_policies
            WHERE tablename = table_name
            AND policyname = 'default_deny'
        );

        -- Add default deny policy if it doesn't exist
        IF NOT EXISTS (
            SELECT 1
            FROM pg_policies
            WHERE tablename = table_name
            AND policyname = 'default_deny'
        ) THEN
            EXECUTE format('CREATE POLICY default_deny ON %I FOR ALL USING (false)', table_name);
        END IF;
    END LOOP;

    -- Special handling for auth tables (keep existing policies)
    -- These tables have their own security mechanisms
    FOR table_name IN ('users', 'sessions', 'identities')
    LOOP
        IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = table_name AND schemaname = 'public') THEN
            EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', table_name);
        END IF;
    END LOOP;
END $$;

-- Verify RLS is enabled
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Count policies
SELECT
    schemaname,
    tablename,
    count(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY schemaname, tablename
ORDER BY tablename;

-- Output message
RAISE NOTICE 'RLS has been enabled globally with default deny policies on all tables.';
RAISE NOTICE 'Tables with RLS enabled: %', (
    SELECT count(*)
    FROM pg_tables
    WHERE schemaname = 'public'
    AND rowsecurity = true
);
RAISE NOTICE 'Total security policies created: %', (
    SELECT count(*)
    FROM pg_policies
    WHERE schemaname = 'public'
);