# EDS Customer Follow-up Tracker - Deployment Guide

## 🚀 GitHub Deployment Steps

### Step 1: Initialize Git Repository
```bash
cd /Users/aarce/Development/Customer-followup
git init
git add .
git commit -m "Initial commit: EDS Customer Follow-up Tracker"
```

### Step 2: Create GitHub Repository
1. Go to [GitHub](https://github.com/cuzuco2)
2. Click "New repository"
3. Repository name: `eds-customer-followup`
4. Description: "EDS Customer Follow-up Tracking System with Google Sheets Integration"
5. Make it **Public** (for easier deployment)
6. **Don't** initialize with README (we already have files)
7. Click "Create repository"

### Step 3: Connect Local Repository to GitHub
```bash
git remote add origin https://github.com/cuzuco2/eds-customer-followup.git
git branch -M main
git push -u origin main
```

### Step 4: Set Up GitHub Pages (Optional - for static hosting)
1. Go to your repository settings
2. Scroll to "Pages" section
3. Source: "Deploy from a branch"
4. Branch: "main"
5. Folder: "/ (root)"
6. Click "Save"

## 📊 Google Sheets Setup

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Project name: `eds-customer-tracker`
4. Click "Create"

### Step 2: Enable Google Sheets API
1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

### Step 3: Create Service Account
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Name: `eds-customer-service`
4. Description: "Service account for EDS Customer Tracker"
5. Click "Create and Continue"
6. Skip role assignment, click "Done"

### Step 4: Generate Credentials
1. Click on your service account
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key"
4. Type: JSON
5. Click "Create"
6. Download the JSON file and rename it to `credentials.json`
7. Place it in your project root directory

### Step 5: Create Google Sheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: "EDS Customer Follow-up"
4. Copy the Sheet ID from the URL (between `/d/` and `/edit`)
5. Example URL: `https://docs.google.com/spreadsheets/d/1ABC123.../edit`
6. Sheet ID: `1ABC123...`

### Step 6: Set Up Sheet Structure
1. In your Google Sheet, add these headers in row 1:
   - A1: Customer Name
   - B1: IMS Org
   - C1: Updates
   - D1: Contract Signed
   - E1: AEM Type
   - F1: Auto-optimization Enabled
   - G1: Issues

2. Format the header row (make it bold, colored background)

### Step 7: Share Sheet with Service Account
1. In your Google Sheet, click "Share"
2. Add the service account email (from your credentials.json file)
3. Give it "Editor" permissions
4. Click "Send"

## 🔧 Environment Configuration

### Step 1: Create Environment File
```bash
cp env.example .env
```

### Step 2: Update .env File
```env
# Google Sheets API Configuration
GOOGLE_SHEETS_CREDENTIALS_PATH=./credentials.json
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SHEET_RANGE=A:Z

# Server Configuration
PORT=3000
NODE_ENV=production
```

### Step 3: Set Up Sheet Structure
```bash
npm run setup-sheet
```

## 🌐 Deployment Options

### Option 1: Heroku Deployment (Recommended)
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create eds-customer-tracker`
4. Set environment variables:
   ```bash
   heroku config:set GOOGLE_SHEET_ID=your_sheet_id
   heroku config:set GOOGLE_SHEET_RANGE=A:Z
   heroku config:set NODE_ENV=production
   ```
5. Upload credentials:
   ```bash
   # Create a config var for credentials
   heroku config:set GOOGLE_CREDENTIALS='{"type":"service_account",...}'
   ```
6. Deploy: `git push heroku main`

### Option 2: Railway Deployment
1. Go to [Railway](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard
4. Deploy automatically

### Option 3: Vercel Deployment
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables
4. Deploy

## 🔐 Security Considerations

### For Production:
1. **Never commit credentials.json to Git**
2. Use environment variables for sensitive data
3. Set up proper CORS policies
4. Consider adding authentication
5. Use HTTPS in production

### Environment Variables for Production:
```env
GOOGLE_SHEET_ID=your_production_sheet_id
GOOGLE_SHEET_RANGE=A:Z
NODE_ENV=production
PORT=3000
```

## 📝 Testing Your Deployment

### Local Testing:
```bash
npm install
npm start
# Visit http://localhost:3000
```

### Production Testing:
1. Visit your deployed URL
2. Test adding a customer
3. Test searching for customers
4. Test updating customer information
5. Verify Google Sheets integration

## 🚨 Troubleshooting

### Common Issues:
1. **"Permission denied"** - Check service account permissions
2. **"Sheet not found"** - Verify Sheet ID and sharing
3. **"API not enabled"** - Enable Google Sheets API
4. **"Credentials error"** - Check credentials.json path

### Debug Steps:
1. Check server logs
2. Verify environment variables
3. Test Google Sheets API access
4. Check network connectivity

## 📚 Additional Resources

- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
- [Heroku Node.js Deployment](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Railway Deployment Guide](https://docs.railway.app/deploy/deploy-nodejs)
- [Vercel Node.js Deployment](https://vercel.com/docs/concepts/deployments/configure-a-build#node.js)

## 🎯 Next Steps After Deployment

1. **Set up monitoring** - Add error tracking
2. **Backup strategy** - Regular Google Sheets backups
3. **User training** - Document usage for team
4. **Maintenance** - Regular updates and security patches
5. **Scaling** - Consider database migration for large datasets
