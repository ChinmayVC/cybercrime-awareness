# How to Run the Cyber Awareness App

## Quick Start (Windows)

### Option 1: Double-click the batch file
1. Double-click `start.bat` in this folder
2. Wait for the server to start
3. Open your browser and go to: `https://localhost:5173`
4. **Important:** You'll see a security warning because it's a self-signed certificate
   - Click **"Advanced"** or **"Show Details"**
   - Then click **"Proceed to localhost"** or **"Accept the Risk"**

### Option 2: Manual Start (Command Prompt or PowerShell)

1. **Open Command Prompt or PowerShell**
   - Press `Win + R`, type `cmd` or `powershell`, press Enter

2. **Navigate to the project folder:**
   ```bash
   cd C:\Users\Arun\cyber-awareness-app
   ```

3. **Install dependencies (only needed once):**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Look for a message like: `Local: https://localhost:5173`
   - Open that URL in Chrome or any browser
   - **Accept the security warning** (click Advanced → Proceed to localhost)
   - If you see a different port number, use that instead

## Troubleshooting

- **Security Warning (Certificate Error):** This is normal! The app uses a self-signed certificate for HTTPS. Click "Advanced" → "Proceed to localhost" to continue.

- **If port 5173 is busy:** The server will automatically use the next available port (5174, 5175, etc.). Check the terminal output for the correct URL.

- **If you see "npm is not recognized":**
  - Install Node.js from https://nodejs.org/
  - Restart your terminal after installing

- **If dependencies are missing:**
  - Run `npm install` first, then `npm run dev`

## The app now runs on HTTPS with a self-signed certificate!
