# Setup Scripts

This directory contains scripts for setting up the EduQuest Supabase project.

## Scripts

- `supabase-project-setup.sh` - Creates and configures Supabase project
- `security-config.sh` - Configures security settings and RLS
- `realtime-setup.sh` - Enables Realtime for specific tables

## Usage

```bash
# Run setup scripts in order
./scripts/setup/supabase-project-setup.sh
./scripts/setup/security-config.sh
./scripts/setup/realtime-setup.sh
```