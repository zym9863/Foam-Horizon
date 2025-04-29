# Foam Horizon

English | [中文](./README.md)

Foam Horizon is an interactive application designed to demonstrate and visualize the formation of filter bubbles. The application simulates how user interactions with content gradually lead to personalized algorithms creating "information bubbles," which limit the diversity of information users are exposed to.

## Features

- **Personalized Information Feed**: Dynamically adjusts content display based on user interaction history
- **Bubble Visualization**: Shows the formation of filter bubbles through dynamic, interactive visualization
- **Topic Interaction**: Users can interact with content from different topics and observe how preferences affect the information feed
- **Bubble Score**: Calculates and displays the user's filter bubble level in real-time
- **Modern Interface**: Employs modern design principles for a smooth user experience

## Technology Stack

- **React 19**: Uses the latest React framework to build the user interface
- **TypeScript**: Provides type safety and better development experience
- **Vite**: Fast frontend build tool
- **Canvas API**: Used to create dynamic bubble visualization effects
- **CSS Variables**: Implements a consistent design system and theming

## Project Structure

```
src/
├── assets/         # Static resource files
├── components/     # React components
│   ├── BubbleVisualization.tsx  # Bubble visualization component
│   ├── Feed.tsx                 # Information feed component
│   ├── FeedItem.tsx             # Feed item component
│   ├── Header.tsx               # Header component
│   └── TopicSelector.tsx        # Topic selector component
├── context/        # React contexts
│   └── UserContext.tsx          # User preferences and state management
├── data/           # Data files
│   └── topics.ts                # Topic and content data
├── types/          # TypeScript type definitions
│   └── index.ts                 # Application type definitions
├── App.css         # Main style file
├── App.tsx         # Main application component
├── index.css       # Global styles and CSS variables
└── main.tsx        # Application entry point
```

## Design Philosophy

Foam Horizon adopts a modern design system, including:

- **Consistent Color System**: Color themes defined using CSS variables
- **Carefully Designed Typography**: Using Google Fonts' Poppins and Noto Sans SC fonts
- **Smooth Animations**: Visual feedback through CSS transitions and Canvas animations
- **Responsive Design**: Layouts that adapt to different screen sizes

## How to Run

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Visit in your browser: `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be located in the `dist` directory.

## License

MIT
