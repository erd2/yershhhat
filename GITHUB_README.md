# Personal Portfolio Website

A modern, responsive personal portfolio website for developers, built with HTML5, CSS3, and JavaScript, featuring a complete backend API for profile management.

![Portfolio Preview](https://img.shields.io/badge/Status-Ready%20to%20Deploy-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Node](https://img.shields.io/badge/Node.js-18+-green)

## 🚀 Live Demo

Visit the live portfolio: [View Website](#)

> **Note**: This is a personal portfolio website for **Toleubayev Yershat** - a developer specializing in adaptive solutions and innovative technologies.

## ✨ Features

### Frontend
- 🎨 **Modern Minimalist Design** - Clean, professional interface inspired by leading dev tools
- 🌓 **Dark/Light Theme** - Automatic theme switching with system preference detection
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- ✏️ **Interactive Profile Editor** - Real-time profile editing with client-side validation
- 🎭 **Smooth Animations** - Refined transitions and micro-interactions
- ♿ **Accessibility** - WCAG compliant with proper ARIA labels and keyboard navigation
- 🔍 **SEO Optimized** - Semantic HTML5 and proper meta tags

### Backend API
- 🚀 **RESTful API** - Complete CRUD operations for profile management
- 🛡️ **Secure** - CORS protection, rate limiting, input validation
- 💾 **SQLite Database** - Lightweight, portable database with automatic setup
- 📝 **Comprehensive Logging** - Request logging with Morgan
- 🔒 **Security Headers** - Helmet.js for enhanced security
- 📊 **Health Monitoring** - API health check endpoints

### Additional Features
- 📄 **PDF Resume Generation** - Automatic resume creation with professional formatting
- 🔗 **GitHub Integration** - Ready for repository and profile integration
- 💾 **Local Storage** - Client-side data persistence
- 🔔 **Toast Notifications** - User feedback system
- 🌐 **Multi-language Ready** - Easily translatable interface

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid & Flexbox
- **JavaScript ES6+** - Vanilla JS with modern features
- **SVG Icons** - Scalable vector icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **SQLite3** - Lightweight database
- **CORS** - Cross-Origin Resource Sharing
- **Helmet.js** - Security middleware
- **Morgan** - HTTP request logger

### Development Tools
- **Nodemon** - Development server with auto-reload
- **Express Validator** - Input validation
- **Rate Limiting** - Request throttling

## 📁 Project Structure

```
portfolio-website/
├── 📄 index.html              # Main portfolio page
├── 🎨 styles.css              # Complete CSS styling
├── ⚡ script.js               # JavaScript functionality
├── 📋 README.md               # Project documentation
├── 🔧 .gitignore              # Git ignore rules
├── 🐍 create_resume.py        # PDF resume generator
└── 📁 backend/                # Backend API
    ├── 🚀 server.js           # Express server
    ├── 📦 package.json        # Dependencies
    ├── 🔐 .env               # Environment configuration
    └── 📊 portfolio.db       # SQLite database
```

## 🚀 Quick Start

### Option 1: Frontend Only (Static Site)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/portfolio-website.git
   cd portfolio-website
   ```

2. **Start a local server**
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Using Node.js (if you have npx)
   npx serve .
   
   # Using PHP
   php -S localhost:8080
   ```

3. **Open in browser**
   ```
   http://localhost:8080
   ```

### Option 2: Full Stack (Frontend + Backend)

1. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Start the backend server**
   ```bash
   npm run dev
   ```

4. **In another terminal, start frontend**
   ```bash
   python -m http.server 8080
   ```

5. **Access the application**
   ```
   Frontend: http://localhost:8080
   Backend API: http://localhost:3001
   ```

## 🎯 Usage Guide

### Editing Your Profile

1. **Click the "Редактировать" button** (bottom-right corner)
2. **Fill out the form** with your information:
   - Name, bio, skills, contact details
   - GitHub link, project descriptions
   - Experience and education details
3. **Click "Сохранить"** - changes are saved immediately
4. **Switch themes** using the moon/sun icon in navigation

### Customizing Content

**Personal Information:**
- Update `index.html` with your details
- Modify the profile data in `script.js`
- Replace placeholder content in all sections

**Styling:**
- Customize colors in CSS variables (`styles.css`)
- Adjust typography, spacing, and layouts
- Add your own brand colors and fonts

**GitHub Integration:**
- Update GitHub username in configuration
- Add your repository links
- Customize project cards

## 📊 API Documentation

### Endpoints

#### Profile Management
```http
GET    /api/profile           # Get current profile
POST   /api/profile           # Create new profile
PUT    /api/profile           # Update profile
GET    /api/profiles          # Get all profiles (paginated)
```

#### Contact
```http
POST   /api/contact           # Send contact message
GET    /api/messages          # Get messages (admin)
```

#### System
```http
GET    /api/health            # Health check
```

### Example API Usage

**Get Profile:**
```bash
curl http://localhost:3001/api/profile
```

**Update Profile:**
```bash
curl -X PUT http://localhost:3001/api/profile \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "bio": "Your bio description",
    "skills": ["Skill 1", "Skill 2"],
    "phone": "+1234567890",
    "github": "https://github.com/username"
  }'
```

## 🎨 Customization

### Colors & Themes

Edit CSS variables in `styles.css`:

```css
:root {
  --brand-blue: #3B82F6;          /* Primary accent color */
  --page-bg-dark: #0A0A0A;        /* Dark theme background */
  --surface-bg-dark: #141414;     /* Dark theme surfaces */
  /* ... more variables */
}
```

### Adding Sections

1. **HTML Structure** - Add new sections in `index.html`
2. **Styling** - Create styles in `styles.css`
3. **Functionality** - Add JavaScript in `script.js`

### Content Updates

**Quick content changes:**
- Name: Update in HTML title and hero section
- Skills: Modify the skills array in JavaScript
- Contact: Update phone and social links
- Projects: Add your own project descriptions

## 🚀 Deployment

### Frontend Deployment

**GitHub Pages:**
1. Push code to GitHub
2. Enable GitHub Pages in repository settings
3. Select main branch as source

**Netlify/Vercel:**
1. Connect GitHub repository
2. Set build command: `echo "Static site"`
3. Deploy automatically

**Traditional Hosting:**
1. Upload files via FTP
2. Ensure proper MIME types for CSS/JS

### Backend Deployment

**Heroku:**
```bash
heroku create your-portfolio-api
git subtree push --prefix backend heroku main
```

**Railway/Render:**
1. Connect GitHub repository
2. Set root directory to `backend/`
3. Configure environment variables

**VPS/Dedicated Server:**
```bash
cd backend
npm install --production
npm start
```

## 🔒 Security Features

- ✅ **Input Validation** - Server-side and client-side validation
- ✅ **CORS Protection** - Configured for specific domains
- ✅ **Rate Limiting** - Prevents API abuse
- ✅ **SQL Injection Protection** - Parameterized queries
- ✅ **Security Headers** - Helmet.js implementation
- ✅ **Environment Variables** - Sensitive data protection

## 📱 Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🧪 Testing

```bash
# Test frontend
# Open index.html in browser and test all features

# Test backend API
curl http://localhost:3001/api/health

# Test profile endpoints
curl http://localhost:3001/api/profile
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Toleubayev Yershat**
- 📧 Contact: +77780958898
- 💼 GitHub: [View Profile](#)
- 💻 Portfolio: [Live Website](#)

## 🙏 Acknowledgments

- Design inspiration from modern developer tools
- CSS Grid and Flexbox for responsive layouts
- Express.js community for backend framework
- SQLite for lightweight database solution

---

⭐ **Star this repository if you found it helpful!**

For questions or support, please create an issue or contact me directly.