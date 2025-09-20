# 🛡️ CleanWipe - Secure Data Erasure Solutions

A modern, professional web application for secure data erasure of electronic devices, built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

### 🎨 **Modern UI/UX**

- **Glass Morphism Design**: Beautiful translucent effects with backdrop blur
- **Gradient Themes**: Professional blue-purple color scheme
- **Smooth Animations**: Fade-in, float, and glow effects
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Interactive Elements**: Hover effects, transitions, and micro-interactions

### 🔐 **Security Features**

- **NIST SP 800-88 Compliant**: Industry-standard data erasure
- **Military-Grade Algorithms**: DoD 5220.22-M compliant wiping
- **Tamper-Proof Certificates**: Digitally signed wipe certificates
- **Cross-Platform Support**: Windows, Linux, and Android devices
- **Aadhar Verification**: DigiLocker integration for identity verification

### 🚀 **Technical Stack**

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 3.4 with custom design system
- **Icons**: Lucide React for consistent iconography
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based with HTTP-only cookies
- **State Management**: React Context API

## 🏗️ Project Structure

```
CleanWipe/
├── app/
│   ├── components/ui/          # Reusable UI components
│   │   ├── Button.tsx         # Enhanced button component
│   │   ├── Card.tsx           # Glass morphism card component
│   │   ├── Input.tsx          # Form input with validation
│   │   ├── FeatureCard.tsx    # Feature showcase cards
│   │   └── StatsCard.tsx      # Statistics display cards
│   ├── api/                   # API routes
│   ├── dashboard/             # Dashboard pages
│   ├── login/                 # Authentication pages
│   ├── signup/                # User registration
│   ├── aadhar-verification/   # Identity verification
│   ├── globals.css            # Global styles and animations
│   └── layout.tsx             # Root layout
├── lib/                       # Utility libraries
├── models/                    # Database models
└── public/                    # Static assets
```

## 🎯 Key Components

### **Enhanced UI Components**

- **Button**: Multiple variants (primary, secondary, outline, ghost, danger) with loading states
- **Card**: Glass morphism effects with hover animations
- **Input**: Enhanced form inputs with icons and validation
- **FeatureCard**: Animated feature showcase cards
- **StatsCard**: Statistics display with trend indicators

### **Pages**

- **Landing Page**: Hero section with animated backgrounds and trust indicators
- **Authentication**: Modern login/signup forms with glass morphism
- **Dashboard**: Interactive dashboard with stats and quick actions
- **Aadhar Verification**: Step-by-step identity verification process

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd CleanWipe
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

5. **Open in Browser**
   Navigate to `http://localhost:3000`

## 🎨 Design System

### **Color Palette**

- **Primary**: Blue (#3B82F6) to Purple (#8B5CF6) gradients
- **Success**: Green gradients for positive actions
- **Warning**: Orange gradients for caution
- **Error**: Red gradients for errors
- **Background**: Light blue to purple gradients

### **Typography**

- **Font Family**: Geist Sans (primary), Geist Mono (code)
- **Headings**: Bold with gradient text effects
- **Body**: Clean, readable text with good contrast

### **Animations**

- **Fade In**: Smooth entrance animations
- **Float**: Subtle floating effects for backgrounds
- **Glow**: Pulsing glow effects for interactive elements
- **Hover**: Lift and scale effects on cards

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Adaptive layouts for tablets
- **Desktop**: Full-featured desktop experience
- **Touch Friendly**: Optimized for touch interactions

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Tokens**: Secure authentication with 7-day expiration
- **CORS Protection**: Configured for cross-origin requests
- **Input Validation**: All inputs validated and sanitized
- **Session Management**: HTTP-only cookies for web sessions

## 🌟 Key Features

1. **Professional Landing Page**: Modern design with trust indicators
2. **Streamlined Authentication**: Clean login/signup forms
3. **Interactive Dashboard**: Statistics and quick actions
4. **Aadhar Verification**: DigiLocker integration
5. **Device Management**: Support for multiple device types
6. **Certificate Generation**: Tamper-proof wipe certificates

## 🎯 User Experience

- **Intuitive Navigation**: Clear navigation with active states
- **Loading States**: Professional loading animations
- **Error Handling**: User-friendly error messages
- **Accessibility**: Focus states and keyboard navigation
- **Performance**: Optimized animations and efficient CSS

## 🚀 Deployment

The application is ready for deployment on:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS**
- **DigitalOcean**

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support or questions, please refer to the documentation or contact the development team.

---

**Made with ❤️ in India** - Promoting secure e-waste management across India
