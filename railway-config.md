# Railway Project Configuration

This document outlines the required configuration for the EduQuest admin dashboard on Railway.

## Environment Variables

Required environment variables that must be set in the Railway dashboard:

### Supabase Configuration
- `SUPABASE_URL` - The URL of your Supabase project
- `SUPABASE_ANON_KEY` - The anonymous public key for Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - The service role key for admin operations (DO NOT EXPOSE TO CLIENTS / NO LOGGING)

### Project Configuration
- `RAILWAY_PROJECT_ID` - Your Railway project ID
- `RAILWAY_SERVICE_NAME` - The service name (should be "eduquest-admin")

### Authentication
- `SITE_URL` - The production URL for the admin dashboard
- `AUTH_CALLBACK_URL` - The callback URL for authentication

## Setup Steps

1. **Create Railway Project**
   - Create a new project on Railway
   - Set the project name to "eduquest-admin"
   - Choose the appropriate region

2. **Add Environment Variables**
   - Go to Railway dashboard → Settings → Variables
   - Add all the environment variables listed above
   - Mark sensitive variables as secret

3. **Deploy Configuration**
   - Railway will automatically detect this is a Node.js project
   - Ensure the start command is set correctly
   - Deploy the project

## Verification

After deployment, verify that:
- The project URL is accessible
- Environment variables are loaded correctly
- Supabase connection works

## Troubleshooting

If environment variables aren't loading:
- Check that variable names match exactly
- Ensure no extra spaces or special characters
- Verify the Railway service is running

For connection issues:
- Verify Supabase project is active
- Check that API keys are correct
- Ensure Railway has access to the Supabase services