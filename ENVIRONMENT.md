# Environment Configuration

This project uses environment variables to manage API keys and configuration. Follow these steps to set up your environment:

## Setting Up Environment Variables

1. Copy `.env.local` to create your own environment file:
   ```bash
   cp .env.local .env.local
   ```

2. Edit `.env.local` and add your OpenAI API key:
   ```
   NEXT_PUBLIC_OPENAI_API_KEY=your_actual_openai_key_here
   ```

   You can obtain an API key from the [OpenAI Platform](https://platform.openai.com/api-keys).

3. Customize other environment variables as needed:
   ```
   NEXT_PUBLIC_ENV=development
   NEXT_PUBLIC_API_BASE_URL=https://api.openai.com/v1
   NEXT_PUBLIC_ENABLE_ANALYTICS=false
   ```

## Environment Files

The project uses different environment files depending on the context:

- `.env.local`: Local overrides, loaded in all environments
- `.env.development`: Development environment variables
- `.env.production`: Production environment variables

## Important Notes

- **NEVER commit your API keys to version control**
- All environment files are added to `.gitignore` to prevent accidental commits
- Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- For server-side only variables (if needed), omit the `NEXT_PUBLIC_` prefix

## How Environment Variables Are Used

The project accesses environment variables safely through the utility functions in `lib/api.ts`, which provides fallbacks and handles both server and client-side code.

Example usage:

```typescript
import { API_CONFIG } from '@/lib/api';

// Use the configuration
console.log(API_CONFIG.API_BASE_URL);
``` 