# 5. Deployment Guide

## 5.1 Local Development
QuantumGuard utilizes a unified Express.js server to serve both the static client application and the API routes.

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
echo 'GEMINI_API_KEY="your_api_key_here"' > .env

# 3. Start the application
npm run start
# Server listens on http://localhost:3000
```

## 5.2 Enterprise Deployment (Ubuntu 24.04 VM)
For production-grade deployments on virtual machines:

1. **Provision the VM** (e.g., 4 vCPUs, 8GB RAM).
2. **Install Node.js**: Use NVM or NodeSource to install Node.js v18+.
3. **Process Management**: Use `pm2` or `systemd` to keep the Express.js server running.
```bash
npm install -g pm2
pm2 start src/server.js --name "quantumguard"
pm2 save
pm2 startup
```
4. **Reverse Proxy**: Configure Nginx to reverse proxy port 80/443 to port 3000, and attach SSL certificates via Let's Encrypt.

## 5.3 Firebase Hosting Deployment
If you intend to host the static assets via Firebase and deploy the backend as a Cloud Function or Cloud Run service:

1. **Initialize Firebase**:
```bash
firebase login
firebase init hosting
```
2. **Configure `firebase.json`**:
Set the `public` directory to `public/`. Configure rewrites to route `/api/**` to your Cloud Run/Functions backend.
3. **Deploy**:
```bash
firebase deploy --only hosting
```
