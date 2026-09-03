# 👗 Veloura

### AI-Powered Digital Wardrobe & Outfit Recommendation System

> **Your style, intelligently curated.**

Veloura is a full-stack AI-powered digital wardrobe platform that transforms a user's clothing collection into an intelligent, searchable wardrobe.

Users can upload photographs of their garments and let **Google Gemini 2.5 Flash Lite** automatically extract structured fashion attributes such as category, color, material, pattern, fit, formality, warmth, breathability, season, and occasion.

This structured wardrobe data is then combined with **weather conditions, occasion context, and style compatibility rules** to generate personalized outfit recommendations.

---

## ✨ What Makes Veloura Different

Traditional wardrobe applications mainly store clothing images.

Veloura goes a step further.

```text
Clothing Image
      ↓
AI Vision Analysis
      ↓
Structured Fashion Metadata
      ↓
Intelligent Digital Wardrobe
      ↓
Context-Aware Recommendation Engine
      ↓
Personalized Outfit Suggestions
```

---

## 🚀 Features

### 🔐 Authentication & User Management

- Clerk V2 authentication
- Secure Bearer token authorization
- Protected client routes
- Backend authentication middleware
- User-scoped wardrobe access
- Profile management
- Avatar upload and persistence
## 👕 Intelligent Digital Wardrobe
- Upload clothing images
- AI-powered garment analysis
- Automatic metadata extraction
- Persistent MongoDB wardrobe
- Search clothing items
- Multi-attribute filtering
- Favorite clothing items
- Edit garment information
- Delete wardrobe items

## 🤖 AI Clothing Analysis

Gemini Vision automatically identifies:

- Category
- Subcategory
- Primary color
- Secondary color
- Color HEX
- Pattern
- Material
- Fit
- Sleeve type
- Neck type
- Formality grade
- Style profile
- Breathability
- Warmth rating
- Season
- Occasion

## 👗 Outfit Recommendations

Recommendations consider:

- Occasion
- Weather
- Season
- Color harmony
- Material compatibility
- Style compatibility
- Formality
- Garment warmth
- Breathability
- User favorites

## 🌦️ Weather-Aware Styling

Veloura integrates live weather information to make recommendations more context-aware.
```text
Weather Conditions
        ↓
Temperature / Conditions
        ↓
Weather Suitability
        ↓
Wardrobe Filtering
        ↓
Outfit Recommendations
```

## 📊 Dashboard

The dashboard provides an overview of the user's wardrobe including:

- Total garments
- Wardrobe composition
- Clothing statistics
- Recent uploads
- Outfit generation activity

---

## 🧠 How Veloura Works

The complete application pipeline can be represented as:

<img width="5419" height="361" alt="mermaid-diagram" src="https://github.com/user-attachments/assets/7bad5756-8337-4768-ab3c-9b530c7a6558" />

## 🤖 AI Clothing Analysis

Veloura uses Google Gemini 2.5 Flash Lite for multimodal clothing analysis.

When a user uploads an image:

<img width="400" height="613" alt="mermaid-diagram (1)" src="https://github.com/user-attachments/assets/d3f49f7c-af51-4e19-a3b9-7c8941755647" />

The AI performs visual feature extraction rather than generating free-form descriptions.

### Example Metadata

```json
{
  "category": "Tops",
  "subcategory": "Oxford Shirt",
  "primaryColor": "Blue",
  "secondaryColor": "White",
  "pattern": ["Striped"],
  "material": ["Cotton"],
  "fit": "Regular",
  "formalityGrade": 3.5,
  "styleProfile": "Smart Casual",
  "breathability": "High",
  "warmthRating": 2,
  "season": ["Spring", "Summer", "Fall"],
  "occasion": ["Casual", "College", "Smart Casual"]
}
```
## 👗 Recommendation Engine

Veloura uses a modular rule-based recommendation pipeline.

<img width="500" height="667" alt="mermaid-diagram (2)" src="https://github.com/user-attachments/assets/67aaeff5-c1ac-426e-8d41-490db7aa4ace" />

### Recommendation Factors
| Factor            | Purpose                                   |
| ----------------- | ----------------------------------------- |
| 🎯 Occasion       | Matches garments to the selected activity |
| 🌦️ Weather        | Considers environmental suitability       |
| 🎨 Color          | Evaluates color harmony                   |
| 👔 Style          | Maintains consistent style profiles       |
| 🧵 Material       | Checks material compatibility             |
| 🔥 Warmth         | Matches clothing warmth to conditions     |
| 🌬️ Breathability  | Helps adapt outfits to warmer conditions  |
| 📅 Season         | Filters seasonally appropriate garments   |
| ❤️ Favorites      | Gives preference to favorited garments    |


The engine follows a deterministic pipeline:
```text
Filter
  ↓
Generate
  ↓
Validate
  ↓
Score
  ↓
Rank
  ↓
Recommend
```

This makes the recommendation process fast, explainable, and independent of repeated LLM calls.

## 🏗️ System Architecture


Veloura follows a modular full-stack architecture where the frontend communicates with a TypeScript REST API and the backend coordinates authentication, persistence, AI processing, and external services.

<img width="800" height="632" alt="mermaid-diagram (3)" src="https://github.com/user-attachments/assets/49108f60-6526-43d0-965d-0bfa822f7270" />

## 🔄 Clothing Upload Data Flow

A clothing upload passes through the following pipeline:

<img width="900" height="395" alt="mermaid-diagram (4)" src="https://github.com/user-attachments/assets/46264976-a57e-4e1d-9ab6-c6026e99fcb0" />

## 🔐 Authentication Architecture

Veloura uses Clerk V2 instead of implementing custom authentication infrastructure.

<img width="3590" height="152" alt="mermaid-diagram (5)" src="https://github.com/user-attachments/assets/9bbb7f82-9600-411a-b982-e0f58829c2e8" />

### Security Principles

- Clerk-managed authentication
- Bearer token authorization
- Protected frontend routes
- Backend authentication middleware
- User-scoped database queries
- Environment-based secrets
- Helmet security headers
- CORS configuration
- Input validation
- No authentication secrets stored in the frontend

## 🛠️ Technology Stack
| Layer          | Technology                   |
| -------------- | ---------------------------- |
| Frontend       | React 19, TypeScript, Vite   |
| Styling        | Tailwind CSS v4              |
| UI             | Lucide React, Sonner         |
| State          | React Context API            |
| Forms          | React Hook Form              |
| Validation     | Zod                          |
| HTTP           | Axios                        |
| Backend        | Node.js, Express 5           |
| Language       | TypeScript                   |
| Database       | MongoDB                      |
| ODM            | Mongoose                     |
| Authentication | Clerk V2                     |
| AI / Vision    | Google Gemini 2.5 Flash Lite |
| Image Storage  | Cloudinary                   |
| Weather        | Open-Meteo                   |
| Deployment     | Vercel + Render              |

--- 

## 📁 Project Structure

```text
Veloura/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   └── wardrobe/
│   │   │
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   │       └── recommendation/
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   └── validations/
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

---

##  🔌 Core API

### Authentication
| Method | Endpoint            | Purpose                     |
| ------ | ------------------- | --------------------------- |
| GET    | `/api/auth/me`      | Retrieve authenticated user |
| PUT    | `/api/auth/profile` | Update profile              |
| POST   | `/api/auth/avatar`  | Upload profile avatar       |
Authentication itself is handled by Clerk.

### Wardrobe
| Method | Endpoint                    | Purpose                     |
| ------ | --------------------------- | --------------------------- |
| POST   | `/api/clothes/upload`       | Upload and analyze clothing |
| GET    | `/api/clothes`              | Retrieve user wardrobe      |
| PUT    | `/api/clothes/:id`          | Update clothing item        |
| DELETE | `/api/clothes/:id`          | Delete clothing item        |
| PATCH  | `/api/clothes/:id/favorite` | Toggle favorite             |

### Dashboard
| Method | Endpoint                       | Purpose                       |
| ------ | ------------------------------ | ----------------------------- |
| GET    | `/api/dashboard/stats`         | Retrieve dashboard statistics |
| POST   | `/api/dashboard/record-outfit` | Record outfit generation      |

# ⚡ Key Engineering Decisions

### 1. AI Analysis During Upload

Instead of calling Gemini every time an outfit is requested:

```text
Upload
   ↓
Gemini Vision
   ↓
Extract Metadata
   ↓
Store in MongoDB
   ↓
Reuse Metadata
```

This reduces repeated AI calls and keeps recommendation generation fast and predictable.

---

### 2. External Services Behind the Backend

The frontend does not directly communicate with Gemini, MongoDB, or Cloudinary for sensitive operations.

```text
React
  ↓
Express API
  ↓
Service Layer
  ↓
External Services
```

This keeps credentials server-side and creates a clear separation of responsibilities.

---

### 3. User-Scoped Data

Wardrobe data is associated with the authenticated MongoDB user.

```text
Clerk Identity
      ↓
Backend Authentication
      ↓
MongoDB User
      ↓
User-Owned Wardrobe
```

This prevents users from accessing another user's clothing collection.

---

# 🚀 Local Development

## Prerequisites

- Node.js
- npm
- MongoDB database
- Clerk application
- Cloudinary account
- Google Gemini API access

---

# 🎯 Design Philosophy

Veloura separates **AI perception** from **recommendation logic**.

```text
AI Layer
    ↓
"Understand the clothing"

Data Layer
    ↓
"Store what we know"

Recommendation Layer
    ↓
"Decide what works together"
```

Gemini is responsible for understanding visual clothing attributes.

The recommendation engine is responsible for combining those attributes with user context.

This separation makes the system easier to reason about, test, and extend.

---

# 🔮 Future Improvements

- 🧠 ML-based personalization from user feedback
- 📅 Outfit calendar and weekly planning
- 👤 Preference learning
- 👗 Virtual try-on
- 📱 Mobile application
- 📈 Advanced wardrobe analytics
- 🕐 Outfit recommendation history
- 🤝 Social wardrobe / style sharing

---

# 📌 Project Status

Veloura currently provides:

```text
✅ Clerk V2 Authentication
✅ Profile & Avatar Management
✅ AI Clothing Analysis
✅ Gemini Vision Integration
✅ Cloudinary Image Storage
✅ MongoDB Wardrobe Persistence
✅ Search & Filtering
✅ Favorites
✅ Dashboard Analytics
✅ Weather-Aware Recommendations
✅ Rule-Based Outfit Recommendation Engine
```

---

# 👨‍💻 Author

### Aditya Jareda

B.Tech Computer Science & Engineering

---

## ⭐ Veloura

**Your style, intelligently curated.**

If you find Veloura interesting, consider giving the repository a ⭐.


