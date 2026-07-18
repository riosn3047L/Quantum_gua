# 5. Installation & Deployment Guide

This document provides highly detailed instructions for installing and deploying the QuantumGuard platform across different environments: Local Development, a dedicated Ubuntu VM, and Firebase Hosting.

---

## 5.1 Local Development Environment
Use this method for testing, contributing to the codebase, or running the application locally on your personal machine.

### Prerequisites
*   Node.js (v18.x or higher) installed.
*   `npm` installed.
*   A valid Google Gemini API Key.

### Step-by-Step Installation
1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-org/QuantumGuard.git
    cd QuantumGuard
    ```

2.  **Install Dependencies**
    Execute npm install to download all required packages into `node_modules`.
    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory. This file securely holds your API credentials and should *never* be committed to version control.
    ```bash
    # Create the .env file
    touch .env
    
    # Add your Gemini API Key using your preferred text editor
    echo 'GEMINI_API_KEY="AIzaSyYourRealKeyHere..."' > .env
    ```

4.  **Start the Application**
    The backend and frontend are served from a single Express.js instance.
    ```bash
    npm run start
    ```
    The terminal should output that the server is listening. Open your web browser and navigate to `http://localhost:3000`.

---

## 5.2 Enterprise Deployment (Ubuntu 24.04 VM)
Use this method for deploying a robust, highly-available instance on a Virtual Private Server (VPS) such as AWS EC2, Google Compute Engine, or DigitalOcean Droplets.

### 1. Provision the Server
*   Deploy an Ubuntu 24.04 LTS instance with at least **2 vCPUs** and **4GB RAM**.
*   SSH into the server.

### 2. Install Node.js & Dependencies
```bash
# Update package lists
sudo apt update && sudo apt upgrade -y

# Install Node.js via NodeSource (v20.x example)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-install -y nodejs git build-essential
```

### 3. Setup the Application
```bash
# Clone the repository to /var/www
cd /var/www
sudo git clone https://github.com/your-org/QuantumGuard.git
cd QuantumGuard

# Install dependencies
sudo npm install

# Configure environment variables
sudo nano .env
# Add: GEMINI_API_KEY="your_api_key"
```

### 4. Configure Process Management (PM2)
PM2 ensures the Node application runs in the background and restarts automatically on crashes or server reboots.
```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application
pm2 start src/server.js --name "quantumguard-api"

# Save the PM2 list and configure it to start on boot
pm2 save
pm2 startup
```

### 5. Setup Reverse Proxy (Nginx)
Do not expose port 3000 directly. Use Nginx to handle port 80/443 and proxy requests to Node.js.
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/quantumguard
```
*Add the following configuration:*
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
```bash
# Enable the site and restart Nginx
sudo ln -s /etc/nginx/sites-available/quantumguard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```
*(Highly Recommended: Secure the domain with Let's Encrypt / Certbot).*

---

## 5.3 Firebase Hosting & Cloud Functions Deployment
QuantumGuard can be fully deployed using Google's Firebase infrastructure (as seen at `social-482013.web.app`).

1.  **Install Firebase CLI & Login**
    ```bash
    npm install -g firebase-tools
    firebase login
    ```
2.  **Initialize Firebase in the Project Root**
    ```bash
    firebase init
    ```
    *   Select **Hosting** and (optionally) **Functions** if deploying the Express app via Cloud Functions.
    *   Set the public directory to `public`.
3.  **Configure `firebase.json` for Rewrites**
    Ensure your `firebase.json` routes `/api/**` traffic to your deployed backend (e.g., a Google Cloud Run instance or Firebase Function), while catching all other traffic for the static `index.html`.
    ```json
    {
      "hosting": {
        "public": "public",
        "rewrites": [
          {
            "source": "/api/**",
            "run": {
              "serviceId": "quantumguard-backend",
              "region": "us-central1"
            }
          },
          {
            "source": "**",
            "destination": "/index.html"
          }
        ]
      }
    }
    ```
4.  **Deploy**
    ```bash
    firebase deploy --only hosting
    ```
