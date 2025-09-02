# BlogHub Frontend

A modern, responsive frontend for the BlogHub API built with vanilla HTML, CSS, and JavaScript.

## 🚀 Quick Start

### Local Development
```bash
cd frontend
npm start
```
Then open `http://localhost:8000` in your browser.

### Vercel Deployment
This frontend is configured for Vercel deployment. Simply connect your GitHub repository to Vercel and it will automatically deploy.

## 📁 Project Structure
```
frontend/
├── public/           # Static files (HTML, CSS, JS)
│   ├── index.html    # Main entry point
│   ├── styles.css    # Styles and responsive design
│   └── script.js     # JavaScript functionality
├── package.json      # Dependencies and scripts
├── vercel.json       # Vercel configuration
└── README.md         # This file
```

## 🌐 Features
- Modern, responsive design
- User authentication (signup/login)
- Blog post management (create, edit, delete)
- Comments system
- Profile management
- Mobile-friendly interface

## 🔧 Configuration
The frontend connects to your BlogHub API. Update the API URL in `public/script.js` for production deployment.

## 📱 Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers
