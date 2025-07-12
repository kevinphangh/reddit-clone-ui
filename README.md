# Reddit Clone UI

A pixel-perfect Reddit clone built with React, TypeScript, and Tailwind CSS. This project recreates Reddit's user interface with exact styling and interactive features.

![Reddit Clone Screenshot](https://via.placeholder.com/800x400?text=Reddit+Clone+UI)

## 🚀 Features

- **Exact Reddit Styling**: Matches Reddit's design system including colors, typography, and spacing
- **Multiple View Modes**: Card, Classic, and Compact post layouts
- **Interactive Components**:
  - Voting system (upvote/downvote)
  - Collapsible comment threads
  - Dropdown menus
  - Post creation form
  - Search functionality
- **Post Types**: Support for text, link, image, video, and poll posts
- **Comment System**: Nested comments with reply functionality
- **Responsive Design**: Works on desktop and mobile devices
- **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

- **Frontend Framework**: React 19
- **Type System**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Routing**: React Router 7
- **Build Tool**: Vite 7
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/reddit-clone-ui.git
cd reddit-clone-ui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Main navigation header
│   ├── Sidebar.tsx     # Right sidebar with subreddit info
│   ├── PostCard.tsx    # Post display component
│   ├── Comment.tsx     # Comment component with threading
│   └── ...
├── pages/              # Route pages
│   ├── HomePage.tsx    # Main feed
│   ├── PostPage.tsx    # Individual post view
│   ├── SubmitPage.tsx  # Create post form
│   └── ...
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and constants
├── data/               # Mock data for demo
└── styles/             # Global styles and Tailwind config
```

## 🎨 Features Breakdown

### Post Feed
- Hot, New, Top, Rising, and Controversial sorting
- Time filters for Top and Controversial
- Card, Classic, and Compact view modes

### Post Cards
- Support for different post types (text, link, image, video)
- Vote counts and voting functionality
- Awards display
- Flair system
- NSFW/Spoiler/OC tags
- Save and hide functionality

### Comment System
- Threaded comments with indentation
- Collapse/expand functionality
- Vote on comments
- Reply to comments
- Comment sorting options
- "Continue this thread" for deep nesting

### Create Post
- Multiple post types (text, image/video, link, poll)
- Community selector
- Flair selection
- Markdown editor toolbar
- NSFW/Spoiler/OC toggles
- Form validation

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Run TypeScript type checking
npm run lint         # Run linting
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This is a UI clone for educational purposes only. Reddit and the Reddit logo are registered trademarks of Reddit Inc. This project is not affiliated with or endorsed by Reddit Inc.