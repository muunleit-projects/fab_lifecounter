---
description: How to redeploy the TCG Life Counter to Fly.io
---

To update the live application with your latest changes:

1. Ensure you are logged in to Fly.io:

```bash
fly auth login
```

2. Deploy the current state of the repository:

```bash
fly deploy --now --remote-only
```

3. Verify the deployment:

```bash
fly status
```

and visit https://tcg-lifecounter.fly.dev/
