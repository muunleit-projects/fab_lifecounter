---
description: How to redeploy the FAB Life Counter to Fly.io
---

### Option 1: Automatic Deployment (Recommended)

1. Simply push your changes to the `main` branch. This will trigger the GitHub Action defined in `.github/workflows/deploy.yml`.

```bash
git push origin main
```

### Option 2: Manual Deployment

1. Ensure you are logged in to Fly.io:

```bash
fly auth login
```

2. Deploy using the configuration files in `deploy/`:

```bash
fly deploy --remote-only --config deploy/fly.toml --dockerfile deploy/Dockerfile
```

3. Verify the deployment:

```bash
fly status
```

and visit https://fab-lifecounter.fly.dev/
