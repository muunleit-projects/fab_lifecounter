# Deploying Updates to Fly.io

This guide explains how to update and redeploy the FAB Life Counter PWA.

## Prerequisites

- **Fly.io CLI (`flyctl`)**: Ensure you have the `fly` command installed.
- **Docker**: Make sure Docker is running on your machine (though `fly deploy` can often use remote builders).

## Update Steps

1.  **Make your changes**: Edit the code in `index.html`, `style.css`, or `main.js`.
2.  **Verify locally (Optional)**:
    ```bash
    npm run dev
    ```
    Visit `http://localhost:5173` to test your changes.
3.  **Deploy**:
    Run the following command in the project root:
    ```bash
    fly deploy
    ```
    This command will:
    - Build the project using the multi-stage `Dockerfile`.
    - Containerize the production-ready files.
    - Push the image to Fly.io.
    - Perform a rolling restart of your instances.

## PWA Asset Updates

If you change the icons or the manifest, ensure you update the `CACHE_NAME` in `public/sw.js` (e.g., from `fab-lc-v1` to `fab-lc-v2`). This forces browsers to download the latest assets immediately.

---

**Live URL**: [https://fab-lifecounter.fly.dev/](https://fab-lifecounter.fly.dev/)
