# Resume 2 Portfolio (R2P) 🚀

Transform your resume into a stunning professional portfolio in minutes! R2P is a modern web application that helps professionals create beautiful, customizable portfolios from their resumes.

## ✨ Features

### 🤖 AI-Powered Resume Parsing
- Upload PDF or DOCX resumes
- Automatic extraction of personal info, experience, education, skills
- Intelligent parsing of various resume formats
- Support for multiple languages

### 📝 Manual Input Option
- Comprehensive form-based input
- Real-time validation
- Rich text editing for descriptions
- Drag-and-drop file uploads

### 🎨 Beautiful Templates
- **Modern**: Clean and professional with gradient accents
- **Minimal**: Simple and elegant design
- **Creative**: Bold and colorful for creative professionals
- **Professional**: Corporate-style for business professionals

### 🎯 Customization
- Color scheme customization
- Font selection (Inter, Roboto, Open Sans, etc.)
- Layout adjustments
- Real-time preview

### 🌐 Publishing & Sharing
- Professional portfolio URLs
- Custom domain support
- SEO optimization
- Social media sharing
- PDF export capability

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4, Framer Motion
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Resume Parsing**: pdf-parse, mammoth.js
- **UI Components**: React Icons, Lucide React
- **State Management**: React Context API

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/resume-to-portfolio.git
   cd resume-to-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   FIREBASE_ADMIN_CLIENT_EMAIL=your_admin_client_email
   FIREBASE_ADMIN_PRIVATE_KEY=your_admin_private_key
   ```

4. **Firebase Setup**
   - Create a Firebase project
   - Enable Authentication (Email/Password, Google)
   - Enable Firestore Database
   - Enable Storage
   - Download service account key for admin SDK

5. **Run the development server**
```bash
npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
resume-to-portfolio/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Main dashboard
│   │   └── portfolio/         # Portfolio pages
│   ├── components/            # React components
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── portfolio/        # Portfolio components
│   │   └── shared/           # Shared components
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utilities and configurations
│   │   ├── firebase/         # Firebase config
│   │   └── templates.js      # Portfolio templates
│   ├── services/             # API services
│   └── utils/                # Utility functions
├── public/                   # Static assets
└── package.json
```

## 🎯 Key Components

### Resume Parsing
- **`ResumeParse.server.js`**: Server-side resume parsing logic
- **`parse-resume/route.js`**: API endpoint for resume processing
- Supports PDF and DOCX formats
- Extracts personal info, experience, education, skills

### Portfolio Builder
- **`ManualForm.js`**: Comprehensive form for manual input
- **`ThemeCustomizer.js`**: Template and styling customization
- **`PreviewPane.js`**: Real-time portfolio preview

### Templates
- **`templates.js`**: Template definitions and components
- Multiple professional designs
- Customizable colors and fonts

### Data Management
- **`PortfolioContext.js`**: Global state management
- **`firestore.jsx`**: Firebase data operations
- **`utils.js`**: Helper functions

## 🔧 Configuration

### Firebase Setup

1. **Authentication**
   - Enable Email/Password authentication
   - Enable Google authentication
   - Configure authorized domains

2. **Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /portfolios/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /resumes/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /userPreferences/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

3. **Storage Rules**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /resumes/{userId}/{allPaths=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /portfolios/{userId}/{allPaths=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository**
   - Push your code to GitHub
   - Connect to Vercel

2. **Environment Variables**
   - Add all Firebase environment variables
   - Configure production settings

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 Features in Detail

### Resume Parsing
- **File Support**: PDF, DOCX
- **Extracted Data**:
  - Personal Information (name, email, phone, location)
  - Work Experience (company, position, dates, description)
  - Education (institution, degree, field, dates)
  - Skills (technical and soft skills)
  - Projects (title, description, technologies)
  - Certifications (name, issuer, date)
  - Languages (language, proficiency)

### Portfolio Templates
- **Modern**: Gradient backgrounds, clean typography
- **Minimal**: Simple design, focus on content
- **Creative**: Bold colors, modern layouts
- **Professional**: Corporate style, conservative colors

### Customization Options
- **Colors**: Primary, secondary, background, text colors
- **Fonts**: Heading and body font selection
- **Layout**: Template-specific customization
- **Content**: All sections are fully editable

### Publishing Features
- **Unique URLs**: Auto-generated portfolio URLs
- **Custom Domains**: Support for custom domain names
- **SEO**: Meta tags, structured data
- **Analytics**: Built-in analytics dashboard
- **Sharing**: Social media integration

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Firebase](https://firebase.google.com/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations
- [React Icons](https://react-icons.github.io/react-icons/) for icons

## 📞 Support

- **Email**: support@resumetoportfolio.com
- **Documentation**: [docs.resumetoportfolio.com](https://docs.resumetoportfolio.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/resume-to-portfolio/issues)

---

Made with ❤️ by the R2P Team 
