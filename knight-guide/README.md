# ♿ Knight Guide

**Accessibility-First AI Travel Platform**

> "Accessibility is not a feature. It is the floor."

Knight Guide is a production-ready MVP that enables users with disabilities to plan accessible travel experiences through AI-powered itinerary generation, accessibility-scored maps, and emergency assistance.

---

## 🎯 Features

### ✅ Core Features (MVP)
- **User Authentication** - Email/password login with Firebase Auth
- **Accessibility Profile** - Store mobility, vision, hearing, cognitive needs
- **AI Itinerary Generation** - Personalized trip planning with Gemini AI
- **Accessibility Score Map** - Color-coded venue markers with Mapbox
- **Emergency Alert System** - One-tap alerts with location & medical info
- **Voice Assistance** - Text-to-speech using Web Speech API
- **WCAG 2.2 AA Compliant** - Full keyboard navigation, screen reader support

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
cd knight-guide

# Install all dependencies
npm run install:all

# Create environment file
cp .env.example .env
```

### Configure Environment

Edit `.env` with your API keys:

```env
# Firebase (get from Firebase Console)
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id

# Mapbox (get from mapbox.com)
VITE_MAPBOX_TOKEN=your_mapbox_token

# Gemini AI (get from ai.google.dev)
GEMINI_API_KEY=your_gemini_key
```

### Run Development Servers

```bash
# Terminal 1: Start client (http://localhost:5173)
cd client && npm run dev

# Terminal 2: Start server (http://localhost:3001)
cd server && npm run dev
```

---

## 📖 Demo Flow

### Complete User Journey (< 60 seconds each feature)

1. **Login/Register** → `/login`
   - Create account with email/password
   - Demo mode works without Firebase config

2. **Set Up Profile** → `/profile`
   - Select accessibility needs (wheelchair, vision, etc.)
   - Add emergency contact & medical notes
   - Test the emergency button

3. **Plan a Trip** → `/itinerary`
   - Enter destination (e.g., "New York City")
   - Select duration
   - View AI-generated accessible itinerary

4. **Explore Map** → `/map`
   - Filter locations by accessibility type
   - Click markers for details
   - View accessibility scores

5. **Voice Reader**
   - Click 🎤 button (bottom-right)
   - Use "Read Page" to hear content
   - Adjust speed as needed

---

## ⌨️ Accessibility Testing

### Keyboard Navigation
- `Tab` - Move between interactive elements
- `Shift+Tab` - Move backwards
- `Enter/Space` - Activate buttons
- `Escape` - Close modals
- Skip link appears on first Tab press

### Screen Reader Testing
```bash
# Windows: Enable Narrator
Win + Ctrl + Enter

# macOS: Enable VoiceOver
Cmd + F5

# Navigate through the app and verify:
# - All content is announced
# - Form labels are read
# - Buttons have clear names
# - Errors are announced
```

### Color Contrast
All text meets 4.5:1 ratio minimum. Color is never the only indicator:
- ✓ High score (green + checkmark)
- ◐ Medium score (yellow + half-circle)
- ✗ Low score (red + X mark)

---

## 📁 Project Structure

```
knight-guide/
├── client/                    # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AccessibleButton.jsx
│   │   │   ├── EmergencyButton.jsx
│   │   │   ├── MapView.jsx
│   │   │   └── VoiceReader.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Itinerary.jsx
│   │   │   └── Map.jsx
│   │   ├── styles/
│   │   │   └── accessibility.css
│   │   └── App.jsx
│   └── vite.config.js
│
├── server/                    # Express Backend
│   ├── routes/
│   │   ├── auth.js
│   │   ├── itinerary.js
│   │   ├── map.js
│   │   └── emergency.js
│   ├── services/
│   │   ├── aiService.js
│   │   ├── accessibilityScore.js
│   │   └── notificationService.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── index.js
│
├── firebase/
│   └── functions/
│       └── index.js
│
├── .env.example
├── package.json
└── README.md
```

---

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/auth/verify` | Verify auth token |
| POST | `/api/itinerary/generate` | Generate AI itinerary |
| GET | `/api/map/locations` | Get accessible locations |
| GET | `/api/map/location/:id` | Get location details |
| POST | `/api/emergency/alert` | Send emergency alert |

---

## ⚠️ Known Limitations (MVP Scope)

1. **Mock SMS** - Emergency alerts are logged to console, not sent via SMS
2. **Demo Data** - Map uses sample NYC locations, not real-time data
3. **English Only** - Single language support
4. **No Offline** - Requires internet connection
5. **No Payments** - Out of scope for MVP

---

## 🛡️ WCAG 2.2 AA Compliance

| Criterion | Status |
|-----------|--------|
| 1.1.1 Non-text Content | ✅ All images have alt text |
| 1.3.1 Info and Relationships | ✅ Semantic HTML used |
| 1.4.3 Contrast (Minimum) | ✅ 4.5:1 ratio enforced |
| 1.4.11 Non-text Contrast | ✅ Focus indicators visible |
| 2.1.1 Keyboard | ✅ Full keyboard navigation |
| 2.1.2 No Keyboard Trap | ✅ Tested modal focus trapping |
| 2.4.1 Bypass Blocks | ✅ Skip to main content link |
| 2.4.4 Link Purpose | ✅ Descriptive link text |
| 2.4.7 Focus Visible | ✅ 3px focus ring |
| 4.1.2 Name, Role, Value | ✅ ARIA labels on all controls |

---

## 📜 License

MIT License - Built for accessibility, open for all.

---

## 🙏 Acknowledgments

- Built with ❤️ for the disability community
- Powered by Gemini AI for intelligent recommendations
- Map data by Mapbox
