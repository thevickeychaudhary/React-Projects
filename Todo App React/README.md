# Enhanced Todo App - React + TypeScript

A modern, feature-rich Todo application built with React, TypeScript, and Vite. This project implements date-based filtering and task priority management as specified in the React Todo App Enhancement Assignment.

## 🚀 Features

### Core Functionality
- ✅ Add, edit, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Persistent storage using localStorage
- ✅ Responsive design for mobile and desktop

### Date Filters
- 📅 **All Tasks** - View all tasks (default)
- 📅 **Today** - Filter tasks created today
- 📅 **This Week** - Filter tasks created this week
- 📅 **Custom Date Range** - Select specific date range with date picker

### Task Priority System
- 🎯 **Customizable Priority Levels** - Create and manage priority labels
- 🎨 **Color-coded Priorities** - Each priority has a customizable color
- ⚡ **Default Priorities** - Critical (red), High (orange), Medium (purple)
- 🏷️ **Priority Display** - Visual priority badges on task cards

### Technical Features
- 🏗️ **Component Architecture** - Modular, reusable components
- 🔄 **State Management** - React Context API for global state
- 🎨 **Modern UI/UX** - Clean, accessible interface with dark mode support
- 📱 **Responsive Design** - Works seamlessly on all device sizes
- 🧪 **Unit Tests** - Comprehensive test coverage for core functionality

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── FilterBar.tsx    # Date filtering component
│   ├── PriorityBadge.tsx # Priority display component
│   └── TaskCard.tsx     # Individual task component
├── context/             # State management
│   └── TaskContext.tsx  # Global state and actions
├── pages/               # Page components
│   └── Home.tsx         # Main application page
├── utils/               # Utility functions
│   └── dateUtils.ts     # Date filtering logic
├── test/                # Test setup
│   └── setup.ts         # Test configuration
└── App.tsx              # Main application component
```

## 🛠️ Technologies Used

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Vitest** - Unit testing framework
- **Testing Library** - Component testing utilities
- **CSS Custom Properties** - Modern styling with dark mode support

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19.0+ or 22.12.0+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-app-react
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🧪 Testing

The project includes comprehensive unit tests for:

- **Date Utilities** - Date filtering logic
- **Priority Badge Component** - Priority display functionality
- **Task Context** - State management and persistence

Run tests:
```bash
npm run test
```

## 📋 Usage Guide

### Adding Tasks
1. Enter task title in the input field
2. Select priority level (optional)
3. Click "Add Task" or press Enter

### Filtering Tasks
1. Use the filter buttons in the Filter Bar:
   - **All Tasks** - Shows all tasks
   - **Today** - Shows tasks created today
   - **This Week** - Shows tasks created this week
   - **Custom Range** - Select specific date range

### Managing Priorities
1. Click the ⚡ button on any task card
2. Select from available priority levels
3. Priorities are displayed as colored badges

### Editing Tasks
1. Double-click on any task title to edit
2. Press Enter to save or Escape to cancel

## 🎨 Design Features

- **Modern UI** - Clean, minimalist design
- **Dark Mode Support** - Automatic theme switching
- **Responsive Layout** - Works on all screen sizes
- **Accessibility** - Semantic HTML and ARIA labels
- **Smooth Animations** - Subtle transitions and hover effects

## 🔧 Customization

### Adding New Priority Levels
The priority system is fully customizable. Default priorities can be modified in `src/context/TaskContext.tsx`:

```typescript
const defaultPriorities: Priority[] = [
  { id: 'critical', label: 'Critical', color: '#ef4444', order: 1 },
  { id: 'high', label: 'High', color: '#f97316', order: 2 },
  { id: 'medium', label: 'Medium', color: '#8b5cf6', order: 3 },
]
```

### Styling
The app uses CSS custom properties for theming. Colors and styles can be customized in `src/App.css`:

```css
:root {
  --primary-color: #646cff;
  --border-color: #e5e7eb;
  /* ... other variables */
}
```

## 📦 Build and Deployment

### Production Build
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

### Deployment Options
- **Vercel** - `vercel --prod`
- **Netlify** - Drag and drop the `dist/` folder
- **GitHub Pages** - Use GitHub Actions for automated deployment
- **Any Static Host** - Upload the `dist/` folder contents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Assignment Requirements Fulfilled

✅ **Date Filters & Time Range**
- Today filter
- This Week filter  
- Custom Date Range with date picker
- Dynamic task re-rendering based on filters
- Default "All Tasks" view

✅ **Task Priority Features**
- Priority assignment when creating/editing tasks
- Customizable priority labels and colors
- Priority display with colored badges on task cards
- Persistent priority storage

✅ **Technical Guidelines**
- React Context API for state management
- Clean component structure as specified
- Semantic HTML and accessible components
- Responsive design for mobile view
- ESLint & Prettier compliance
- Modular, reusable components

✅ **Deliverables**
- Fully functional Todo app with all features
- Updated README with solution description
- Basic unit tests for new functionality
- FilterBar component for date-based filters
- PriorityBadge component for priority display
- Enhanced TaskCard component with priority display

---

**Built with ❤️ using React, TypeScript, and modern web technologies.**