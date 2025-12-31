# Sudoku Game - React Native (Expo)

A fully functional Sudoku game with **Azure Cosmos DB** for puzzles and leaderboard. Built with React Native and Expo for web, iOS, and Android.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Azure Cosmos DB account ([Create one](https://portal.azure.com))
- npm or yarn

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd SudokuFramer
npm install
```

### 2. Setup Azure Cosmos DB

#### Create Database and Containers

1. **Create Cosmos DB Account:**
   - Go to [Azure Portal](https://portal.azure.com)
   - Create new Cosmos DB account (NoSQL API)
   - Note down the endpoint and primary key

2. **Create Database:**
   - Name: `SudokuDB`

3. **Create Containers:**
   
   **Scores Container:**
   - Container id: `Scores`
   - Partition key: `/difficulty`
   - Throughput: 400 RU/s (Manual)

   **Puzzles Container:**
   - Container id: `Puzzles`
   - Partition key: `/difficulty`
   - Throughput: 400 RU/s (Manual)

#### Data Migration

If migrating from Notion, JSON backup files are in `scripts/`:
- `notion-scores.json` - 14 scores
- `notion-puzzles.json` - 25 puzzles

You can manually upload these via Azure Portal Data Explorer.

### 3. Environment Setup

Create `.env.local` in the project root:

```env
COSMOS_ENDPOINT=https://your-account-name.documents.azure.com:443/
COSMOS_KEY=your-primary-key-here
```

⚠️ **Never commit `.env.local` to git!**

### 4. Run Locally

#### Development Mode (Recommended)
This runs both the backend server (API) and the frontend (Expo) simultaneously.

```bash
# Start both Backend (port 8080) and Frontend (port 8081)
npm run dev

# Press 'w' in the Metro Bundler terminal to open Web
```

#### Alternative: Manual (Two Terminals)
If you prefer running them separately:

**Terminal 1 (Backend):**
```bash
npm start
```

**Terminal 2 (Frontend):**
```bash
npx expo start
```

Opens at http://localhost:8081

#### Production Mode (Test before deploy)
```bash
# Build for web
npx expo export --platform web

# Start production server
npm start
```

Opens at http://localhost:8080

---

## ✨ Features

### Game Features
- 📱 **Cross-platform**: Web, iOS, and Android
- 🎮 Three difficulty levels (Easy, Medium, Hard)
- ✅ Real-time validation with error highlighting
- ⌨️ Keyboard input support (1-9, Backspace, Delete)
- 🏆 Global leaderboard with filtering
- 🌙 Dark mode support
- 📊 Win detection and score tracking

### Technical Features
- **Azure Cosmos DB** for data persistence
- REST API endpoints for scores and puzzles
- React Native + Expo for cross-platform
- TypeScript for type safety
- Styled-components for styling
- CI/CD with GitHub Actions

---

## 🗄️ Database Schema

### Scores Collection
```json
{
  "id": "unique-id",
  "userName": "Player Name",  
  "time": 125,
  "difficulty": "easy",
  "date": "2025-12-28T00:00:00Z"
}
```

### Puzzles Collection
```json
{
  "id": "1",
  "puzzleId": 1,
  "difficulty": "medium",
  "puzzle": [[0,0,0,...], ...], // 9x9 array
  "solution": [[5,3,4,...], ...] // 9x9 array
}
```

---

## 📡 API Endpoints

All endpoints are in `server.js`:

### Scores
- `GET /api/scores` - Get all scores
- `GET /api/scores?difficulty=hard` - Filter by difficulty
- `POST /api/scores` - Save new score
  ```json
  {
    "userName": "John",
    "time": 125,
    "difficulty": "easy"
  }
  ```

### Puzzles
- `GET /api/puzzles` - Get all puzzles
- `GET /api/puzzles?difficulty=medium` - Filter by difficulty
- `GET /api/puzzles/random?difficulty=easy` - Get random puzzle

---

## 🏗️ Project Structure

```
SudokuFramer/
├── src/
│   ├── components/          # Reusable components
│   │   ├── GameTimer.tsx
│   │   ├── Header.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── NumberPad.tsx
│   │   └── ThemeToggle.tsx
│   ├── game/                # Game logic
│   │   ├── GameWrapper.tsx
│   │   ├── SudokuGame.tsx
│   │   └── hooks/           # Custom React hooks
│   ├── data/                # Data layer
│   │   ├── CosmosDB.ts      # Cosmos DB service
│   │   └── Database.tsx     # Data types & API calls
│   └── shared/              # Shared utilities
│       ├── store.ts
│       └── types.ts
├── scripts/                 # Data backups
│   ├── notion-scores.json
│   └── notion-puzzles.json
├── server.js                # Express server with API
├── App.tsx                  # Entry point
└── package.json
```

---

## 🧪 Testing

### Run Tests
```bash
# All tests
npm test

# Specific test suite
npm run test:hooks

# With coverage
npm test -- --coverage
```

### Quality Checks
```bash
# TypeScript check
npm run type-check

# Full validation (TS + Tests)
npm run validate

# Pre-deployment check
npm run pre-deploy
```

---

## 🚀 Deployment

### CI/CD Pipeline

The app deploys automatically via GitHub Actions when pushing to `main`:

1. **Type checking** - Warns on TypeScript errors
2. **Unit tests** - Must pass (16 tests)
3. **Build** - Creates production bundle
4. **Deploy** - Pushes to Azure Web App

### Manual Deployment

```bash
# Build
npx expo export --platform web

# Deploy (uploads dist folder)
# Configure in Azure Portal
```

### Environment Variables in Azure

Add these in Azure Portal → App Service → Configuration:

- `COSMOS_ENDPOINT` - Your Cosmos DB endpoint
- `COSMOS_KEY` - Your Cosmos DB primary key

---

## 💰 Cost Estimate

**Azure Cosmos DB:**
- 2 containers × 400 RU/s × $0.008/hour
- ~$50/month total

**Azure Web App:**
- Free tier available
- Production: ~$13/month (B1 tier)

**Total:** ~$50-65/month

### Cost Optimization
- Use Serverless mode if low traffic (< 1M requests/month)
- Scale down RU/s based on usage metrics
- Combine containers to save ~$25/month

---

## 🔧 Tech Stack

- **Frontend:** React Native, Expo
- **Backend:** Node.js, Express
- **Database:** Azure Cosmos DB (NoSQL)
- **Styling:** Styled Components
- **Language:** TypeScript
- **Testing:** Vitest
- **CI/CD:** GitHub Actions
- **Hosting:** Azure Web App

---

## 📝 Scripts Reference

```bash
# Development
npm run dev:expo          # Start Expo dev server
npm run ios               # iOS simulator
npm run android           # Android emulator
npm run web               # Web browser

# Production
npm start                 # Production server (port 8080)
npm run build             # Build for production (use expo export)

# Testing
npm test                  # Run tests
npm run test:ui           # Test with UI
npm run test:hooks        # Hook tests only

# Quality
npm run type-check        # TypeScript validation
npm run validate          # Full validation
npm run pre-deploy        # Pre-deployment checks
```

---

## 🐛 Troubleshooting

### "Resource Not Found" Error
- Check that Cosmos DB containers are created
- Verify `COSMOS_ENDPOINT` and `COSMOS_KEY` in `.env.local`

### White Screen on http://localhost:8080
- Run `npx expo export --platform web` first
- Check that `dist/` folder exists and has files

### Leaderboard Not Loading
- Check browser console for fetch errors
- Verify server is running on port 8080
- Check Cosmos DB has data in Scores container

### Puzzles Not Loading
- Check Cosmos DB Puzzles container has data
- Verify `/api/puzzles/random?difficulty=easy` returns data
- Check server logs for errors

---

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Azure Cosmos DB Documentation](https://learn.microsoft.com/azure/cosmos-db/)
- [Styled Components](https://styled-components.com/)

---

## 📄 License

MIT

---

## 🙏 Acknowledgments

Built with React Native, Expo, and Azure Cosmos DB.
